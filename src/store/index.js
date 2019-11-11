import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

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
    boards: {},
    boards_selected: [],
    cards: [],
    last_refresh: null,
    trello_auth: {
      key: '',
      token: '',
      connected: false
    }
  },
  mutations: {
    init_store (state) {
      /* Init store from localStorage if present */
      if (localStorage.getItem('store')) {
        this.replaceState(
          Object.assign(state, JSON.parse(localStorage.getItem('store')))
        )
      }
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
    remove_cards (state, board_id) {
      /* Remove cards for board_id */
      state.cards = state.cards.filter(c => c.board_id !== board_id)
    },
    add_cards (state, cards) {
      // Get only ids of new cards
      let cards_new_ids = []
      cards.forEach(c => cards_new_ids.push(c.id))

      // Create new cards array but exclude "old" cards with same id as new cards
      let cards_new = [
        // Filter: return cards with ids NOT in cards_new_ids array
        ...state.cards.filter(c => !cards_new_ids.includes(c.id)),
        ...cards
      ]

      state.cards = cards_new
    },
    set_last_refresh (state) {
      state.last_refresh = new Date()
    }
  },
  actions: {
    get_my_boards (context) {
      trelloAPI.get('members/me/boards', {
        params: {
          key: context.state.trello_auth.key,
          token: context.state.trello_auth.token,
          fields: 'name,shortUrl',
          filter: 'open'
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
      context.state.boards_selected.forEach(board_id => {
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
            if (!c.dueComplete && !c.isTemplate) {
              c['board_id'] = board_id
              if (c.due !== null) {
                c['due'] = new Date(c.due)
              }

              cards.push(c)
            }
          })

          context.commit('add_cards', cards)
          context.commit('set_last_refresh')
        })
      })
    }
  },
  modules: {
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
