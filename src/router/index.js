import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/pages/Index'
import Home from '@/pages/home/Index'
import AccountLogin from '@/pages/account/Login'
import AccountRegister from '@/pages/account/Register'
import Album from '@/pages/album/Index'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path:'/home',
      name:'Home',
      component:Home
    },
    {
      path:'/album/:albumId',
      name:'Album',
      component:Album
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
