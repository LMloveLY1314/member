import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import Storage from './util/storage'

const whiteList = ['/login']

/**
 *
 * */

//路由跳转之前，判断是否有refresh_token，获取用户权限列表，鉴权失败跳转登录页
router.beforeEach((to, from, next) => {

    //启动进度条
    NProgress.start()
    //获取refresh_token
    const refreshToken = Storage.getItem('consumer_refresh_token')
    if (refreshToken) {
       next()

    } else {
        //如果没有refresh——token，判断是不是访问登录页，如果不是，强制转到登录页
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login?forward=${location.pathname}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
