import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import AMapJS from 'amap-js'
// 创建AMapJSAPI Loader
var aMapJSAPILoader = new AMapJS.AMapJSAPILoader({
  key: '21d2805b1b3b94b2c35975460006531f',
  v: '1.4.12' // 版本号
})

// 创建AMapUI Loader
var aMapUILoader = new AMapJS.AMapUILoader({
  v: '1.0' // UI组件库版本号
})

aMapJSAPILoader.load().then(function(AMap) {
  aMapUILoader.load().then(function(initAMapUI) {
    var AMapUI = initAMapUI() // 这里调用initAMapUI初始化并返回AMapUI
    // 其他逻辑
  })
})

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */
import { mockXHR } from '../mock'
if (process.env.NODE_ENV === 'production') {
  mockXHR()
}

// set ElementUI lang to EN
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
