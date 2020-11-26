//对axios进行封装
import Vue from 'vue'
import { Loading } from 'element-ui'
import axios from 'axios'
import Storage from '../util/storage'
//qs 是一个增加了一些安全性的查询字符串解析和序列化字符串的库。
const qs = require('qs')

// 创建axios实例
const service = axios.create({
    // baseURL: 'http://yixiu.vipgz1.idcfengye.com',//配置基础访问路径
    baseURL: 'http://localhost:7000',
    timeout: 20000,
    //参数序列化器
    //paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
})
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


    /** 配置全屏加载 */
    if (config.loading !== false) {
        config.loading = Loading.service({
            lock: true,
            background: 'rgba(0, 0, 0, 0.7)',
            spinner: 'el-icon-loading',
            text: '请稍候...'
        })
    }

    const uuid = Storage.getItem('consumer_uuid')
    config.headers['uuid'] = uuid

    /** 设置令牌
     * 获取存在cookie中的token，设置令牌
     * */
    let accessToken = Storage.getItem('consumer_access_token')
    if (accessToken) {
            config.headers['Authorization'] = accessToken
    }
    return config
}, error => {
    Promise.reject(error)
})

// respone拦截器，如果服务器返回状态码为403，表示没有权限，自动跳转登录页
service.interceptors.response.use(
    async response => {
        await closeLoading(response)
        return response.data
    },
    async error => {
        await closeLoading(error)
        const error_response = error.response || {}
        const error_data = error_response.data || {}
        if (error_response.status === 403) {
            if (!Storage.getItem('consumer_refresh_token')) return
            store.dispatch('fedLogoutAction')
            window.location.replace(`/login?forward=${location.pathname}`)
            return
        }
        if (error.config.message !== false) {
            let _message = error.code === 'ECONNABORTED' ? '连接超时，请稍候再试！' : '网络错误，请稍后再试！'
            Vue.prototype.$message.error(error_data.message || _message)
        }
        return Promise.reject(error)
    }
)


/**
 * 关闭全局加载
 * 延迟200毫秒关闭，以免晃眼睛
 * @param target
 */
const closeLoading = (target) => {
    if (!target.config.loading) return true
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            target.config.loading.close()
            resolve()
        }, 200)
    })
}

export default function request(options) {
    // 如果是刷新token或者登录，不需要检查token直接请求。
    if (options.url.indexOf('/consumer/passport/login') + options.url.indexOf('systems/admin-users/token') > -2) {
        return service(options)
    }
    return new Promise((resolve, reject) => {
        //checkToken(options).then(() => {
            service(options).then(resolve).catch(reject)
      //  })
    })
}

export const Method = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete'
}
