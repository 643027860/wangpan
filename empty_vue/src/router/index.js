import Vue from 'vue'
import VueRouter from 'vue-router'

import Home from '../components/home'
import File from '../components/file'
import Zhong from '../components/zhong'
import Video from '../components/video'
import Music from '../components/music'
import Apply from '../components/apply'
import Image from '../components/image'
import Text from '../components/text'
import Rubbish from '../components/rubbish'
import Login from '../components/login'

Vue.use(VueRouter)

export default new VueRouter({
  routes:[
    {
      path:'/home',
      component:Home,
      children:[
        {
          path:'file',
          component:File
        },
        {
          path:'zhong',
          component:Zhong
        },
        {
          path:'image',
          component:Image
        },
        {
          path:'video',
          component:Video
        },
        {
          path:'text',
          component:Text
        },
        {
          path:'apply',
          component:Apply
        },
        {
          path:'music',
          component:Music
        },
        {
          path:'rubbish',
          component:Rubbish
        },
        {
          path:'',
          redirect: 'image'
        },
      ]
    },
    {
      path:'/login',
      component: Login
    },
    {
      path:'',
      redirect:'/login'
    },
  ]
})
