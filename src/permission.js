import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {LocalStorage} from '@/utils/storage'
const _import = require('./router/_import_') //获取组件的方法
import Layout from '@/layout'
import {get} from '@/utils/request'
import Vue from 'vue'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
function compare(property){
  return function(a,b){
    var value1 = a[property];
    var value2 = b[property];
    return value1 - value2;
  }
}

function getTree(data) {
  let cloneData = JSON.parse(JSON.stringify(data))
  let treeData =  cloneData.filter(father=>{
    let branchArr = cloneData.filter(child=>father.id === child.parent_id && child.type === 2)    //返回每一项的子级数组
    branchArr.length>0 ? father.auth2_list = branchArr : ''   //如果存在子级，则给父级添加一个auth2_list属性，并赋值
    return father.parent_id === 1 && father.status === 1 && father.type === 1;      //返回第一层
  });
  let bp = []
  cloneData.forEach( item => {
    if (item.type === 3) {
      bp.push(item.permission_path)
    }
  })
  let date = new Date().getTime();
  //LocalStorage.set('permission',treeData,date + 10000*60*60*1000)
  LocalStorage.set('bp',bp,date + 10000*60*60*1000)
  return {treeData:treeData,bp:bp}
}
var getRouter;
const whiteList = ['/login']

router.beforeEach( async(to, from, next) => {
  NProgress.start()
  var constantRoutes = [],base = LocalStorage.get('base'),token = LocalStorage.get('token')
  if (token) {
    const per = store.getters.per && store.getters.per.length > 0
    if (per) {
      next()
    } else {
      //获取site配置信息
      try{
        await store.dispatch('user/getConfig')
      }catch (e) {
        Message.error(error || 'Has Error')
      }


      if (base.role_id === 1) {
        //系统管理员
        try{
          const  permin  = await store.dispatch('user/getAdminPer')
          let res = getTree(permin)
          res.treeData.sort(compare('sort'))
          let g_route = '' ,init=''
          if (!JSON.stringify(res.treeData).includes('dashboard')) {
            if (res.treeData[0].auth2_list !==undefined) {
              g_route = res.treeData[0].auth2_list[0]['permission_path']
            } else {
              g_route = res.treeData[0]['permission_path']
            }
            init = {
              path:"/",
              redirect: '/'+g_route
            }
          }else{
            init ={
              path:"/",
              redirect: '/dashboard'
            }
          }

          var arr = []
          for (var i=0;i<res.treeData.length;i++) {
            var obj = {}

            obj.path = '/'+res.treeData[i]['permission_path']
            obj.name = '/'+res.treeData[i]['permission_path']
            obj.component = 'Layout'
            obj.children = []
            obj.redirect = '/'+res.treeData[i]['permission_path']+'/index'

            if (res.treeData[i]['auth2_list'] !== undefined) {
              //有二级菜单
              obj.meta = {title:res.treeData[i]['permission_name']}
              obj.alwaysShow = true
              for (var j=0;j<res.treeData[i]['auth2_list'].length;j++) {
                var child = {}
                //加入详情页
                if (res.treeData[i]['auth2_list'][j]['status'] === 2) {
                  child.hidden = true
                }
                child.path = '/'+res.treeData[i]['auth2_list'][j]['permission_path']
                child.name = '/'+res.treeData[i]['auth2_list'][j]['permission_path']
                child.component = res.treeData[i]['auth2_list'][j]['permission_path']
                child.meta = { title: res.treeData[i]['auth2_list'][j]['permission_name']}
                obj.children.push(child)
              }
            } else {
              var child2 = {},url =res.treeData[i]['permission_path']
              child2.path = 'index'
              child2.component = url+'/index'
              child2.name = res.treeData[i]['permission_path']
              child2.meta = { title: res.treeData[i]['permission_name']}
              obj.children.push(child2)
            }
            //console.log(obj)
            arr.push(obj)
          }
          constantRoutes.push(init)
          constantRoutes = constantRoutes.concat(arr)
          constantRoutes.push( { path: '*', redirect: '/404', hidden: true })
        }catch (error) {
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }

      } else {
        try{
          const  permin  = await store.dispatch('user/getOtherPer')
          //其他角色
          let res = getTree(permin)
          res.treeData.sort(compare('sort'))
          let g_route = '' ,init=''
          if (!JSON.stringify(res.treeData).includes('dashboard')) {
            if (res.treeData[0].auth2_list !==undefined) {
              g_route = res.treeData[0].auth2_list[0]['permission_path']
            } else {
              g_route = res.treeData[0]['permission_path']
            }
            init = {
              path:"/",
              redirect: '/'+g_route
            }
          }else{
            init ={
              path:"/",
              redirect: '/dashboard'
            }
          }
          var arr = []
          for (var i=0;i<res.treeData.length;i++) {
            var obj = {}
            obj.path = '/'+res.treeData[i]['permission_path']
            obj.name = '/'+res.treeData[i]['permission_path']
            obj.component = 'Layout'
            obj.children = []
            obj.redirect = '/'+res.treeData[i]['permission_path']+'/index'
            if (res.treeData[i]['auth2_list'] !== undefined) {
              //有二级菜单
              obj.meta = {title:res.treeData[i]['permission_name']}
              obj.alwaysShow = true
              for (var j=0;j<res.treeData[i]['auth2_list'].length;j++) {
                var child = {}
                //加入详情页
                if (res.treeData[i]['auth2_list'][j]['status'] === 2) {
                  child.hidden = true
                }
                child.path = '/'+res.treeData[i]['auth2_list'][j]['permission_path']
                child.name = '/'+res.treeData[i]['auth2_list'][j]['permission_path']
                child.component = res.treeData[i]['auth2_list'][j]['permission_path']
                child.meta = { title: res.treeData[i]['auth2_list'][j]['permission_name']}
                obj.children.push(child)
              }
            } else {
              var child2 = {},url =res.treeData[i]['permission_path']
              child2.path = 'index'
              // child2.component = () => import('@/views/'+url+'/index')
              child2.component = url+'/index'
              child2.name = res.treeData[i]['permission_path']
              child2.meta = { title: res.treeData[i]['permission_name']}
              obj.children.push(child2)
            }
            arr.push(obj)
          }
          constantRoutes.push(init)
          constantRoutes = constantRoutes.concat(arr)
          constantRoutes.push( { path: '*', redirect: '/404', hidden: true })
        }catch (error) {
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  }

  if (!getRouter) { //不加这个判断，路由会陷入死循环
    if (!LocalStorage.get('router')) {
      if (!token) {
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
        LocalStorage.set('router', getRouter,date+10000*60*60*1000) //存储路由到localStorage
        routerGo(to, next) //执行路由跳转方法
      }
    } else { //从localStorage拿到了路由

      //getRouter = LocalStorage.get('router') //拿到路由
      getRouter =constantRoutes //拿到最新的路由
      //console.log(getRouter)
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
