import VueRouter from 'vue-router'

import store from './store'

import ListView from './views/ListView.vue'
import WeekView from './views/WeekView.vue'
import Error404View from './views/Error404View.vue'
import AuthView from './views/AuthView.vue'

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/list' },
    { path: '/list', component: ListView },
    { path: '/week', component: WeekView },
    { path: '/auth', component: AuthView },
    { path: '*', component: Error404View }
  ]
})

router.beforeEach((to, from, next) => {
  // Init store
  if (!store.state.is_init) {
    store.commit('init_store')
  }

  // Check if auth details are present
  if (store.state.trello_auth.key === '') {
    if (to.path !== '/auth') {
      next('/auth')
    } else {
      next()
    }
  }
  next()
})

export default router
