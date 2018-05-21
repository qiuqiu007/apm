import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'

Vue.use(Router)

export default new Router({
  base: '/shop/',
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    }
  ]
})
