import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from "./router";
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import  './assets/css/base.css'
import  './assets/styles/_color.scss'
import './permission'
import axios from 'axios'
import { ActionSheet,DatetimePicker,CellGroup,NavBar,Tabs,Icon,List,Dialog,Popup,Tab,Search,Tabbar,Cell,Button,Field,Uploader } from 'vant'
import 'vant/lib/index.css';
import RegionPicker from "./components/RegionPicker";
import  '../src/assets/scripts/jquery.addressSelect-mobile'

//注册全局过滤器
import * as filters from './filters' // global filter

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})


Vue.component(RegionPicker.name, RegionPicker)

//配置axios
axios.defaults.baseURL='http://localhost:7003'
//将axios注册到Vue模型的http属性，使用http来使用axios
Vue.prototype.$http=axios;
/**设置启动端口  加个--port来指定
"serve": "vue-cli-service serve --port 3000"
 */
//安装vant插件
Vue.use(DatetimePicker)
Vue.use(ActionSheet)
Vue.use(CellGroup)
Vue.use(Field)
Vue.use( NavBar)
Vue.use( Tabs)
Vue.use( Icon)
Vue.use( List)
Vue.use(Dialog)
Vue.use(Popup)
Vue.use(Tab)
Vue.use(Search)
Vue.use(Tabbar)
Vue.use(Cell)
Vue.use(Button)
Vue.use(Uploader)


Vue.use(Element)
Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
