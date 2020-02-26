import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission'
import {get, post} from '@/utils/request'

//将axios封装加入到Vue 原型里 直接this.$http.get调用
Vue.prototype.$http = {
  get,
  post
}
Vue.prototype.url = 'http://10.10.35.250:8199/v1'

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
