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
    add_cards (state, cards) {
      let cards_new = {
        ...state.cards,
        ...cards
      }

      state.cards = cards_new
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

          // Process each card
          response.data.forEach(c => {
            // Only process cards which are not yet completed
            if (!c.dueComplete) {
              c['board_id'] = board_id
              c['due'] = new Date(c.due)

              cards[c.id] = c
            }
          })

          context.commit('add_cards', cards)
        })
      })
    }
  },
  modules: {
  }
})
