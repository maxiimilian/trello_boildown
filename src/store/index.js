import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

const trelloAPI = axios.create({
  baseURL: 'https://api.trello.com/1/'
})

export default new Vuex.Store({
  state: {
    boards: [
    ],
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
    }
  },
  actions: {
    get_my_boards (context) {
      // let boards = {}
      trelloAPI.get('members/me/boards', {
        params: {
          key: context.state.trello_auth.key,
          token: context.state.trello_auth.token,
          fields: 'name',
          filter: 'open'
        }
      }).then(response => {
        context.commit('set_connection_state', true)
        context.commit('set_boards', response.data)
      })
    }
  },
  modules: {
  }
})
