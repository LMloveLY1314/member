import  Vue from 'vue';
import VueRouter from 'vue-router'

import Layout from "../views/layout";
//安装组件
Vue.use(VueRouter)
//路由懒加载，跳转到该路由时才加载组件

//初始路由，登录注册这些页面
export const  constantRouterMap=[
    {
        path: 'profile/my-profile',
        component: () => import('../views/profile/my-profile')
    },
    {
        path:'/login',
        component:()=>import('../views/login')
    },

    //查看报价列表
    {
        path:'/order/offer',
        component:()=>import('../views/offerList')
    },
    //订单评论
    {
        path:'/order/comment',
        component:()=>import('../views/order/comment/comments')
    },

    {
        path:'',
        component:Layout,
        redirect: '/home',
        children:[
            {path:'/profile',component:()=>import('../views/profile/index'),meta:{title:'我的'}},
            {path:'/home',component:()=>import('../views/home'),meta:{title:'首页'}},
            {path:'/order',component:()=>import('../views/order'),meta:{title:'订单'}},
            {path:'/massage',component:()=>import('../views/massage'),meta:{title:'消息'}},
        ]
    },
//发布悬赏
    {
        path:"/release",
        component:()=>import('../views/release'),
        meta: {
            title: "发布悬赏"
        }
    },
//人才市场
    {
        path:"/repair-core",
        component:()=>import('../views/home/repairCore'),
        meta: {
            title: "人才市场"
        }
    },
    //维修师傅详情
    {
        path:"/repair-detail",
        name:"repairDetail",
        component:()=>import('../views/home/repairDetail'),
        meta: {
            title: "师傅详情"
        }
    },
    // //维修师傅评价列表
    // {
    //     path:"/repair/comment",
    //     name:"repairComment",
    //     component:()=>import('../views/home/orderComments'),
    //     meta: {
    //         title: "师傅评论"
    //     }
    // },
    //发起支付
    {
        path:"/checkout/cashier",
        component:()=>import('../views/checkout/cashier'),
        meta: {
            title: "订单支付"
        }
    },
    //支付页面跳转页面
    {
        path:"/checkout/cashier-load-pay",
        component:()=>import('../views/checkout/cashier-load-pay'),
        meta: {
            title: "支付跳转"
        }
    },
    //支付完成页面
    {
        path:"/payment-complete",
        component:()=>import('../views/payment-complete'),
        meta: {
            title: "支付跳转"
        }
    },
    //个人中心
    {
        path:"/profile",
        component:()=>import('../views/profile/index'),
        meta: {
            title: "我的"
        }
    },
    {
        path:"/profile/my-profile",
        component:()=>import('../views/profile/my-profile'),
        meta: {
            title: "我的"
        }
    },
    /** 我的消息*/


//    我的订单
    {
        path:"/order/my-order",
        component:()=>import('../views/order/my-order/index'),
        meta: {
            title: "我的订单"
        }
    },
//    订单详情
    {
        path:"/order/my-order/detail",
        component:()=>import('../views/order/my-order/detail'),
        meta: {
            title: "订单详情"
        }
    },
//    系统公告
    {
        path:'/notice',
        component:()=>import('../views/notice/index'),
        meta:{title:'系统公告'}
    },
]

//登录之后把这个路由合并上去
export const asyncRouterMap = []

const  router=new VueRouter({
    mode:'history',//使用HTML history模式，否则是hash模式
    routes:constantRouterMap
})
router.beforeEach((to,from,next)=>{
    document.title=to.meta.title;
    next();
})

export default router
