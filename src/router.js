import VueRouter from 'vue-router'

import store from './store'
import m from './store/mutations.js'

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
  ],
  linkActiveClass: 'active'
})

router.beforeEach((to, from, next) => {
  // Init store
  if (!store.state.is_init) {
    store.commit(m.INIT_STORE)
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
