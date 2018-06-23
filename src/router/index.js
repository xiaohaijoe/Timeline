import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import AccountLogin from '@/pages/account/Login'
import AccountRegister from '@/pages/account/Register'
import Dynamic from '@/pages/Dynamic'
import Album from '@/pages/Album'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path : '/account/login',
      name : 'Login',
      component:AccountLogin,
    },
    {
      path : '/account/register',
      name : 'Register',
      component:AccountRegister,
    },
  ]
})
