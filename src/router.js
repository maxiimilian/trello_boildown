import VueRouter from 'vue-router'

import ListView from './views/ListView.vue'
import WeekView from './views/WeekView.vue'
import Error404View from './views/Error404View.vue'
import AuthView from './views/AuthView.vue'

import store from './store/index.js'

function require_auth (to, from, next) {
  if (store.state.trello_auth.key === '') {
    next('/auth')
  } else {
    next()
  }
}

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/list' },
    { path: '/list', component: ListView, beforeEnter: require_auth },
    { path: '/week', component: WeekView, beforeEnter: require_auth },
    { path: '/auth', component: AuthView },
    { path: '*', component: Error404View }
  ]
})

export default router
