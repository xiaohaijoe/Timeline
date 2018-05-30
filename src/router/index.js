import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Dynamic from '@/pages/Dynamic'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
