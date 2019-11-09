import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const trelloAPI = axios.create({
  baseURL: 'https://api.trello.com/1/'
})

export default new Vuex.Store({
  state: {
    boards: {},
    boards_selected: [],
    cards: {},
    cards_overdue: {},
    cards_not_scheduled: {},
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
          console.log(`${board_id} was de-selected`)
        }
      })
      state.boards_selected = boards_selected_new
    },
    remove_cards (state, board_id) {
      /* Remove cards for board_id */
      let cards_new = {}

      for (let c_id in state.cards) {
        let c = state.cards[c_id]
        if (c.board_id !== board_id) {
          cards_new[c_id] = c
        }
      }
      state.cards = cards_new
    },
    add_cards (state, context) {
      /*
       * context should be an object providing cards and type of cards (due, overdue, not scheduled)
       * context = {
       *   type: 'cards_overdue'
       *   cards: { .. }
       * }
       */
      // Update and merge existing cards in store with new data
      let cards_new = {
        ...state[context.type],
        ...context.cards
      }

      state[context.type] = cards_new
    }
  },
  actions: {
    get_my_boards (context) {
      trelloAPI.get('members/me/boards', {
        params: {
          key: context.state.trello_auth.key,
          token: context.state.trello_auth.token,
          fields: 'name',
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
      let today = new Date()

      context.state.boards_selected.forEach(board_id => {
        trelloAPI.get(`boards/${board_id}/cards`, {
          params: {
            key: context.state.trello_auth.key,
            token: context.state.trello_auth.token,
            fields: 'name,dueComplete,due',
            filter: 'open'
          }
        }).then(response => {
          let cards = {}
          let cards_overdue = {}
          let cards_not_scheduled = {}

          // Process each card
          response.data.forEach(c => {
            c['board_id'] = board_id

            // Not scheduled without due date
            if (c.due === null) {
              cards_not_scheduled[c.id] = c
            } else {
              // Only process cards which are not yet completed
              if (!c.dueComplete) {
                c.due = new Date(c.due)

                if (c.due < today) {
                  // Overdue cards
                  cards_overdue[c.id] = c
                } else {
                  // Cards due in the future
                  cards[c.id] = c
                }
              }
            }
          })

          context.commit('add_cards', {
            type: 'cards',
            cards: cards
          })
          context.commit('add_cards', {
            type: 'cards_overdue',
            cards: cards_overdue
          })
          context.commit('add_cards', {
            type: 'cards_not_scheduled',
            cards: cards_not_scheduled
          })
        })
      })
    }
  },
  modules: {
  }
})
