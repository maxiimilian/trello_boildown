import Vue from 'vue'
import App from './App.vue'
import store from './store'

import axios from 'axios'
import VueAxios from 'vue-axios'

import '../public/css/normalize.css'
import '../public/libs/semantic-ui/semantic.min.css'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)

new Vue({
  store,
  render: h => h(App),
  beforeCreate () {
    this.$store.commit('init_store')
  },
  created () {
    if (this.$store.state.trello_auth.key !== '' && this.$store.state.trello_auth.token !== '') {
      this.$store.dispatch('get_my_boards').then(() => {
        if (this.$store.state.trello_auth.connected && this.$store.state.boards_selected !== []) {
          this.$store.dispatch('get_cards')
        }
      })
    }
  }
}).$mount('#app')

store.subscribe((mutation, state) => {
  /* Save parts of store to localStorage  */
  let store = {
    trello_auth: {
      key: state.trello_auth.key,
      token: state.trello_auth.token,
      connected: false
    },
    boards_selected: state.boards_selected
  }

  localStorage.setItem('store', JSON.stringify(store))
})
