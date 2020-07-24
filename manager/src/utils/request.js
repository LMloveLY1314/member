import axios from 'axios'
import qs from 'qs'
import { Message, MessageBox } from 'element-ui'
import { getSession } from '@/utils/auth'
import store from '@/store'

// axios.defaults.withCredentials=true //让axios携带cookie

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 15000, // 请求超时时间
  // withCredentials:true,

})
// request（请求）拦截器
service.interceptors.request.use(config => { // 在发送请求之前做些什么
  // config.headers['Content-Type'] = 'application/json'
  // 如果是put/post请求，用qs.stringify序列化参数
  const is_put_post = config.method === 'put' || config.method === 'post'
  const is_json = config.headers['Content-Type'] === 'application/json'
  if (is_put_post && is_json) {
    config.data = JSON.stringify(config.data)
  }
  if (is_put_post && !is_json) {
    config.headers['Content-Type'] = 'application/json'
    config.data = JSON.stringify(config.data)
    // config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
  }
  return config
}, error => { // 对请求错误做些什么
  Promise.reject(error)
})
// respone（响应）拦截器
service.interceptors.response.use( // 对响应数据做点什么
  response => {
    // if (typeof response.data.data == "string" && response.data.code != "A000") {
    //   response.data = JSON.parse(response.data.data); //json格式化
    // }
    // if (response.data.code == "A000") {
    //   MessageBox.confirm('你的验证已过期，可以取消继续留在该页面，或者重新登录', '确定登出', {
    //     confirmButtonText: '重新登录',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     store.dispatch('FedLogOut').then(() => {
    //       location.reload() // 为了重新实例化vue-router对象 避免bug
    //     })
    //   });
    // }
    // console.log(response.data)
    return response.data
  },
  error => { // 对响应错误做点什么
    console.log(error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
