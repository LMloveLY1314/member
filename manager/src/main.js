
import Vue from 'vue'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import '@/styles/index.scss' // global css

import App from './App'
import router from './router'
import store from './store'
//引入公共组件
import  EnTableLayout from './components/TableLayout/src/main'
Vue.component('en-table-layout',EnTableLayout);

//引入全局工具
import mixin from './utils/mixin'
Vue.mixin(mixin)

// 全局注册echarts(baidu画图工具)
import echarts from "echarts"
Vue.prototype.$echarts = echarts

// import '@/permission' // permission control

Vue.use(ElementUI, {
  size: 'medium', // set element-ui default size
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
