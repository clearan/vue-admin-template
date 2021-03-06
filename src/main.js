import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/utils/global'//全局
import '@/permission' // permission control
import {get, post,put,patch,del} from '@/utils/request'

//将axios封装加入到Vue 原型里 直接this.$http.get调用
Vue.prototype.$http = {
  get,
  post,
  put,
  patch,
  del
}
//Vue.prototype.url = 'http://10.10.35.250:8199/v1'
Vue.prototype.url = 'http://18.163.218.80:8199/v1'

Vue.use(ElementUI)
import {CountDown} from 'vant'
Vue.use(CountDown)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
