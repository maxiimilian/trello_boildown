import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

import m from './mutations.js'
import a from './actions.js'

Vue.use(Vuex)

const trelloAPI = axios.create({
  baseURL: 'https://api.trello.com/1/'
})

function sort_cards_by_due (cards, asc = true) {
  /* Returns a sorted card array, sorted ascending (default) or descending */
  return cards.sort(function (c1, c2) {
    return asc ? c1.due - c2.due : c2.due - c1.due
  })
}

function sort_cards_by_board_name (cards, asc = true) {
  return cards.sort(function (c1, c2) {
    if (c1.board_id === c2.board_id) {
      return c1.name > c2.name ? -1 : 1
    } else {
      return c1.board_id > c2.board_id ? -1 : 1
    }
  })
}

function preprocess_card (card, board_id) {
  // Return null if card does not match filter
  if (card.dueComplete) return null
  if (card.isTemplate) return null

  // Attach board_id to card
  card['board_id'] = board_id

  // Create date object instead of date string
  if (card.due !== null) {
    card['due'] = new Date(card.due)
  }

  return card
}

export default new Vuex.Store({
  state: {
    is_init: false,
    trello_auth: {
      key: '',
      token: '',
      connected: false
    },
    boards: {},
    boards_selected: [],
    cards: [],
    last_refreshed: undefined,
    cards_loading: false
  },
  mutations: {
    [m.INIT_STORE] (state) {
      /* Init store from localStorage if present */
      if (localStorage.getItem('store')) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        )
      }
      state.is_init = true
    },
    [m.SET_AUTH_KEY] (state, value) {
      state.trello_auth.key = value
    },
    [m.SET_AUTH_TOKEN] (state, value) {
      state.trello_auth.token = value
    },
    [m.SET_CONNECTION_STATE] (state, value) {
      state.trello_auth.connected = value
    },
    [m.SET_BOARDS] (state, value) {
      state.boards = value
    },
    [m.SET_BOARDS_SELECTED] (state, boards_selected_new) {
      // Check if any board was de-selected
      state.boards_selected.forEach(board_id => {
        if (!boards_selected_new.includes(board_id)) {
          // Remove all cards associated with de-selected board
          this.commit(m.REMOVE_CARDS, board_id)
          // console.log(`${board_id} was de-selected`)
        }
      })
      state.boards_selected = boards_selected_new
    },
    [m.SET_LAST_REFRESHED] (state, value) {
      state.last_refreshed = value
    },
    [m.SET_CARDS_LOADING] (state, value) {
      state.cards_loading = value
    },
    [m.REMOVE_CARDS] (state, board_id) {
      /* Remove cards for board_id */
      state.cards = state.cards.filter(c => c.board_id !== board_id)
    },
    [m.ADD_CARDS] (state, { cards, board_id }) {
      /* Keep all cards not belonging to `board_id` and add all `cards` passed */
      state.cards = [
        ...state.cards.filter(c => c.board_id !== board_id),
        ...cards
      ]
    },
    [m.UPDATE_CARD] (state, updated_card) {
      // Find old card by card id
      let card_index = state.cards.findIndex(c => c.id === updated_card.id)
      let card = state.cards[card_index]

      // Update all common keys of existing card with new values
      for (let key in card) {
        if (key in updated_card) {
          card[key] = updated_card[key]
        }
      }

      // Process card
      card = preprocess_card(card, card.board_id)

      if (card !== null) {
        // Move updated card back to cards array if not completed
        state.cards[card_index] = card
      } else {
        // Remove if completed
        state.cards = state.cards.filter(c => c.id !== updated_card.id)
      }
    }
  },
  actions: {
    [a.GET_BOARDS] (context) {
      /*
       * Get list of boards from Trello.
       * Return Promise to allow error handling outside of action
       */
      return trelloAPI.get('members/me/boards', {
        params: {
          key: context.state.trello_auth.key,
          token: context.state.trello_auth.token,
          fields: 'name,shortUrl',
          filter: 'open',
          lists: 'open'
        }
      }).then(response => {
        context.commit(m.SET_CONNECTION_STATE, true)

        // Save boards in object with id as key
        let boards = {}
        response.data.forEach(b => {
          boards[b.id] = b
        })

        context.commit(m.SET_BOARDS, boards)
      })
    },
    [a.GET_CARDS] (context) {
      // Triggers loading indicators
      context.commit(m.SET_CARDS_LOADING, true)

      // Store all api promises
      let api_promises = []

      // Fetch cards from all selected boards
      context.state.boards_selected.forEach(board_id => {
        api_promises.push(
          trelloAPI.get(`boards/${board_id}/cards`, {
            params: {
              key: context.state.trello_auth.key,
              token: context.state.trello_auth.token,
              fields: 'name,dueComplete,due,isTemplate,shortUrl',
              filter: 'open'
            }
          }).then(response => {
            let cards = []

            // Process each card
            response.data.forEach(c => {
              // Preprocess card and push them to list if not discarded by filters (i.e. `null`)
              c = preprocess_card(c, board_id)
              if (c !== null) cards.push(c)
            })

            context.commit(m.ADD_CARDS, {
              cards: cards,
              board_id: board_id
            })
          })
        )
      })

      // Wait for all api promises to finish before setting `last_refreshed` and `loading`
      Promise.all(api_promises).then(() => {
        context.commit(m.SET_LAST_REFRESHED, moment())
        context.commit(m.SET_CARDS_LOADING, false)
      })
    },
    [a.UPDATE_CARD] (context, { card_id, data }) {
      /*
       * Update a card in Trello and update local cards array.
       * Data have to be ready for Trello!
       */
      // Use return to catch potential errors in api call
      return trelloAPI.put(`cards/${card_id}`, {
        key: context.state.trello_auth.key,
        token: context.state.trello_auth.token,
        ...data
      }).then(response => {
        // Trello returns updated card. Save to app's store.
        context.commit(m.UPDATE_CARD, response.data)
      })
    },
    [a.RELOAD] (context) {
      /* Alias for get_cards. Added because maybe future requires specific reload action */
      context.dispatch(a.GET_CARDS)
    }
  },
  getters: {
    cards_not_scheduled: state => {
      return sort_cards_by_board_name(
        state.cards.filter(c => c.due === null)
      )
    },
    cards_overdue: state => {
      let today = new Date().setHours(0, 0, 0)
      return sort_cards_by_due(
        state.cards.filter(c => c.due !== null).filter(c => c.due < today)
      )
    },
    cards_due: state => {
      let today = new Date().setHours(0, 0, 0)
      return sort_cards_by_due(
        state.cards.filter(c => c.due !== null).filter(c => c.due >= today)
      )
    }
  }
})
