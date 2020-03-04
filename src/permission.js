import router from './router'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {LocalStorage} from '@/utils/storage'
const _import = require('./router/_import_') //获取组件的方法
import Layout from '@/layout'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

var getRouter;
const whiteList = ['/login']
router.beforeEach( (to, from, next) => {
  let constantRoutes = [],permission = LocalStorage.get('permission');
  // console.log(permission);return
  if (permission) {
    let main =
      {
        path: '/',
        component: 'Layout',
        redirect: '/dashboard',
        children: [{
          path: 'dashboard',
          name: 'Dashboard',
          component: 'dashboard/index',
          meta: { title: '系统首页', icon: 'dashboard' }
        }]
      }
    constantRoutes.push(main)
    var arr = []
    for (var i=0;i<permission.length;i++) {
      var obj = {}
      obj.path = '/'+permission[i]['permission_path']
      obj.name = '/'+permission[i]['permission_path']
      obj.component = 'Layout'
      obj.children = []
      if (permission[i]['auth2_list'] !== undefined) {
        //有二级菜单
        obj.meta = {title:permission[i]['permission_name']}
        obj.alwaysShow = true
        for (var j=0;j<permission[i]['auth2_list'].length;j++) {
          var child = {}
          //加入详情页
          if (permission[i]['auth2_list'][j]['status'] === 2) {
            child.hidden = true
          }
          child.path = '/'+permission[i]['auth2_list'][j]['permission_path']
          child.name = '/'+permission[i]['auth2_list'][j]['permission_path']
          child.component = permission[i]['auth2_list'][j]['permission_path']
          child.meta = { title: permission[i]['auth2_list'][j]['permission_name']}
          obj.children.push(child)
        }
      }
      arr.push(obj)
    }
    constantRoutes = constantRoutes.concat(arr)
    constantRoutes.push( { path: '*', redirect: '/404', hidden: true })
  }
  NProgress.start()
  if (!getRouter) { //不加这个判断，路由会陷入死循环
    console.log(permission)
    if (!LocalStorage.get('router')) {
      if (!permission) {
        if (whiteList.indexOf(to.path) !== -1) {
          //当前路由走白名单
          next()
        } else {
          //不是login就走根目录
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }else{
        //console.log(constantRoutes)
        getRouter = constantRoutes //假装模拟后台请求得到的路由数据
        let date = new Date().getTime();
        LocalStorage.set('router', getRouter,date+20*60*1000) //存储路由到localStorage
        routerGo(to, next) //执行路由跳转方法
      }
    } else { //从localStorage拿到了路由

      getRouter = LocalStorage.get('router') //拿到路由
      console.log(getRouter)
      routerGo(to, next)
    }
  } else {
    next()
  }
})


function routerGo(to, next) {
  getRouter = filterAsyncRouter(getRouter) //过滤路由
  router.addRoutes(getRouter) //动态添加路由
  global.antRouter = getRouter //将路由数据传递给全局变量，做侧边栏菜单渲染工作
  next({ ...to, replace: true })
}

function filterAsyncRouter(asyncRouterMap) { //遍历后台传来的路由字符串，转换为组件对象
  const accessedRouters = asyncRouterMap.filter(route => {
    if (route.component) {
      // console.log(route.component)
      // console.log(typeof route.component)
      if (route.component === 'Layout') { //Layout组件特殊处理
        //console.log("=========== enter ==============")
        route.component = Layout
      } else {
        // if (typeof route.component == 'string') {
        //   route.component = _import(route.component)
        // }
        route.component = _import(route.component)
      }
    }
    if (route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children)
    }
    return true
  })

  return accessedRouters
}

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
