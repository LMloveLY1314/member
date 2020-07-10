import axios from 'axios'
import store from '@/store'
import { Message } from 'element-ui'
//qs 是一个增加了一些安全性的查询字符串解析和序列化字符串的库。
const qs = require('qs')

/ 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,//配置基础访问路径
  timeout: 20000,
  withCredentials:true
  //参数序列化器
  //paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})

//试着让axios访问时携带cookis，设置了很多次都没成功，突然就成功了？？？？？？？？
service.defaults.withCredentials=true //让ajax携带cookie
//添加请求拦截器，请求之前，序列化请求参数，将UUID，token封装到请求头中
service.interceptors.request.use(config=>{
  // 如果是put/post请求，用qs.stringify序列化参数
  const is_put_post = config.method === 'put' || config.method === 'post'
  const is_json = config.headers['Content-Type'] === 'application/json'
  if (is_put_post && is_json) {
    config.data = JSON.stringify(config.data)
  }
  if (is_put_post && !is_json) {
    config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
  }
  return config
}, error => {
  Promise.reject(error)
})


// respone拦截器，如果服务器返回状态码为403，表示没有权限，自动跳转登录页
service.interceptors.response.use(
  async response => {
    return response.data
  },
  async error => {
    await closeLoading(error)
    const error_response = error.response || {}
    const error_data = error_response.data || {}
    // if (error_response.status === 403) {
    //   if (!Storage.getItem('admin_refresh_token')) return
    //   store.dispatch('fedLogoutAction')
    //   window.location.replace(`/login?forward=${location.pathname}`)
    //   return
    // }
    if (error.config.message !== false) {
      let _message = error.code === 'ECONNABORTED' ? '连接超时，请稍候再试！' : '网络错误，请稍后再试！'
      Vue.prototype.$message.error(error_data.message || _message)
    }
    return Promise.reject(error)
  }
)

export default function request(options) {
  // // 如果是刷新token或者登录，不需要检查token直接请求。
  // if (options.url.indexOf('admin/system/login') + options.url.indexOf('systems/admin-users/token') > -2) {
  //   return service(options)
  // }
  return new Promise((resolve, reject) => {
    //checkToken(options).then(() => {
    service(options).then(resolve).catch(reject)
    //  })
  })
}


//封装axios，对请求和响应数据做处理
// const request = function(url, data) {
//   console.log(data);
//   return new Promise((resolve, reject) => {
//     axios.post(process.env.BASE_API + url, data, {
//       headers: {
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//         'token': store.getters.token,
//       }
//     }).then(response => {
//       const data = response.data.obj;
//       resolve(response)
//     }).catch(error => {
//       Message.error("error：" + "请检查网络是否连接");
//       reject(error)
//     })
//   })
// };

// export default request
