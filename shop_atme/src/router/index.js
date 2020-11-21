import Vue from 'vue'
import Router from 'vue-router'

import login from '@/views/login'
import layout from '@/views/layout'
import { Message } from 'element-ui'
Vue.use(Router)

let router =  new Router({
  routes: [
    {
      path : '/login',
      component : login
    },
    {
      path : '/',
      component : layout,
      children : [
        {
          path : 'index',
          component : ()=> import('@/views/layout/index')
        },
        {
          path : 'menu',
          component : ()=> import('@/views/layout/menu')
        },
        {
          path : 'role',
          component:()=> import('@/views/layout/role')
        },
        {
          path : 'user',
          component:()=> import('@/views/layout/user')
        },
        {
          path : 'category',
          component:()=> import('@/views/layout/category')
        },
        {
          path:"specs",
          component:()=> import("@/views/layout/specs")
        },{
          path:"goods",
          component:()=> import("@/views/layout/goods")
        },
        {
          path:"member",
          component:()=> import("@/views/layout/member")
        },
        {
          path:"banner",
          component:()=> import("@/views/layout/banner")
        },
        {
          path:"seckill",
          component:()=> import("@/views/layout/seck")
        },
        {
          path : '*',
          redirect : '/index'
        }
      ]
    }
  ]
})
router.beforeEach((to,from,next)=>{
  //已登录
  if(localStorage.getItem('userinfo')){
    if(to.path=='/login'){
      next(false)
    }else{
      let urls = JSON.parse(localStorage.getItem('userinfo')).menus_url.concat(['/','/index']);
      let flag = urls.find(item=>item==to.path);
      if(flag){
        next()
      }else{
        Message.error('权限不足')
        next(false)
      }
     
    }
  }else{//未登录
    if(to.path=='/login'){
      next()
    }else{
      next('/login')
    }
  }
})


export default router;
