import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import moment from 'moment'

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
    init_store (state) {
      /* Init store from localStorage if present */
      if (localStorage.getItem('store')) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        )
      }
      state.is_init = true
    },
    set_auth_key (state, value) {
      state.trello_auth.key = value
    },
    set_auth_token (state, value) {
      state.trello_auth.token = value
    },
    set_connection_state (state, value) {
      state.trello_auth.connected = value
    },
    set_boards (state, value) {
      state.boards = value
    },
    set_boards_selected (state, boards_selected_new) {
      // Check if any board was de-selected
      state.boards_selected.forEach(board_id => {
        if (!boards_selected_new.includes(board_id)) {
          // Remove all cards associated with de-selected board
          this.commit('remove_cards', board_id)
          // console.log(`${board_id} was de-selected`)
        }
      })
      state.boards_selected = boards_selected_new
    },
    set_last_refreshed (state, value) {
      state.last_refreshed = value
    },
    set_cards_loading (state, value) {
      state.cards_loading = value
    },
    remove_cards (state, board_id) {
      /* Remove cards for board_id */
      state.cards = state.cards.filter(c => c.board_id !== board_id)
    },
    add_cards (state, { cards, board_id }) {
      /* Keep all cards not belonging to `board_id` and add all `cards` passed */
      state.cards = [
        ...state.cards.filter(c => c.board_id !== board_id),
        ...cards
      ]
    },
    update_card (state, updated_card) {
      // Find old card by card id
      let card_index = state.cards.findIndex(c => c.id === updated_card.id)
      let card = state.cards[card_index]

      // Update all common keys of existing card with new values
      for (let key in card) {
        if (key in updated_card) {
          card[key] = updated_card[key]
        }
      }

      // @todo: Duplicate behavior here and in get_cards action
      // convert due date to time object
      if (card.due !== null) {
        card['due'] = new Date(card.due)
      }

      // Move updated card back to cards array
      state.cards[card_index] = card
    }
  },
  actions: {
    get_my_boards (context) {
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
        context.commit('set_connection_state', true)

        // Save boards in object with id as key
        let boards = {}
        response.data.forEach(b => {
          boards[b.id] = b
        })

        context.commit('set_boards', boards)
      })
    },
    get_cards (context) {
      // Triggers loading indicators
      context.commit('set_cards_loading', true)

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
              // Only process cards which are not yet completed
              // @todo: Duplicate behavior here and in update_card mutation
              if (!c.dueComplete && !c.isTemplate) {
                c['board_id'] = board_id
                if (c.due !== null) {
                  c['due'] = new Date(c.due)
                }

                cards.push(c)
              }
            })

            context.commit('add_cards', {
              cards: cards,
              board_id: board_id
            })
          })
        )
      })

      // Wait for all api promises to finish before setting `last_refreshed` and `loading`
      Promise.all(api_promises).then(() => {
        context.commit('set_last_refreshed', moment())
        context.commit('set_cards_loading', false)
      })
    },
    update_card (context, { card_id, data }) {
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
        context.commit('update_card', response.data)
      })
    },
    reload (context) {
      /* Alias for get_cards. Added because maybe future requires specific reload action */
      context.dispatch('get_cards')
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
