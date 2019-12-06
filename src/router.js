import VueRouter from 'vue-router'

import ListView from './views/ListView.vue'
import WeekView from './views/WeekView.vue'
import Error404View from './views/Error404View.vue'
import AuthView from './views/AuthView.vue'

export default new VueRouter({
  routes: [
    { path: '/', redirect: '/list' },
    { path: '/list', component: ListView },
    { path: '/week', component: WeekView },
    { path: '/auth', component: AuthView },
    { path: '*', component: Error404View }
  ]
})
