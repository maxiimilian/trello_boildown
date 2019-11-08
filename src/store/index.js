import Vue from 'vue'
import Vuex, { mapGetters } from 'vuex'
// import { Vuex, mapGetters } from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    boards: [
      { name: 'PTest', selected: true },
      { name: 'PTost', selected: false },
      { name: 'PTast', selected: true },
      { name: 'PTist', selected: false }
    ],
    trello_auth: {
      key: '',
      token: '',
      successful: false
    }
  },
  mutations: {
  },
  actions: {
    get_my_trello_boards (context) {

    }
  },
  modules: {
  },
  computed: {
    ...mapGetters([
      'boards',
      'trello_auth'
    ])
  }
})
