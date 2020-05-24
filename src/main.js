/*
  Copyright (C) 2020 maxiimilian

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'

import App from './App.vue'
import store from './store'
import router from './router'

import a from './store/actions.js'

import '../include/css/normalize.css'
import '../include/libs/semantic-ui/semantic.min.css'
import './registerServiceWorker'

Vue.config.productionTip = false
Vue.use(VueAxios, axios)
Vue.use(VueRouter)

new Vue({
  store,
  router,
  render: h => h(App),
  created () {
    // Populate boards and get cards, if key and token are set.
    if (this.$store.state.trello_auth.key !== '' && this.$store.state.trello_auth.token !== '') {
      this.$store.dispatch(a.GET_BOARDS).then(() => {
        this.$store.dispatch(a.GET_CARDS)
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
