import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'
Vue.use(Router)
var constantRouterMap=[
  {
  path: '/login',
  component: () => import('@/views/login/index'),
  hidden: true
},
//   {
//   path: '/',
//   component: Layout,
//   redirect: '/dashboard',
//   children: [{
//     path: 'dashboard',
//     name: 'Dashboard',
//     component: () => import('@/views/dashboard/index'),
//     meta: { title: 'Dashboard', icon: 'dashboard' }
//   }]
// },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
]
//目前有的两个路由一个不能少
export default new Router({
  routes: constantRouterMap

})
