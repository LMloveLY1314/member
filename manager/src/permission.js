import router from './router'
import store from './store'
import { Message } from 'element-ui'
// import { getSession, removeSession } from '@/utils/auth' // 验权


const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => { //全局前置守卫
  //从sessionStorage取出user，如果有，表示已经登录
  const user = sessionStorage.getItem("user");
  if (user) { //验证登陆权限通过，进入主界面 routes.forEac
    //构建路由数组
    store.dispatch('GenerateRoutes').then(() => {
      //构建用户路由后，添加到路由中
      // console.log("最终路由"+store.getters.addRouters)
      router.addRoutes(store.getters.addRouters)
    })
    if (to.path === '/login') {
      next({path: '/'});
    }
    // 如果是访问根路径或dashboard
    if (to.path === '/' || to.path === "/dashboard") {
      next({path: '/hyxxgl'});
    }else {//如果是其它路径，直接访问
      next();
    }
    // if (store.getters.roles.length === 0) { //是否有用户信息
    //   store.dispatch('GetUserInfo').then(() => {
    //     next();
    //   }).catch(() => {
    //     Message.error('验证失败,请重新登录');
    //     removeSession();
    //     next('/login');
    //   });
    // }
  }
  else { //验证不通过
    if (whiteList.indexOf(to.path) !== -1) { //如果是登陆界面不重定向
      next();
    } else {
      Message.error('验证失败,请重新登录');
      next('/login');
    }
  }
});
