import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'
// const _import = require('./_import_' + process.env.NODE_ENV)
const _import = require('./_import_production')
Vue.use(Router)

//asyncRouterMap为异步路由，即某个用户具体的路由权限
export const asyncRouterMap = [
    //会员信息管理
    {
      path: '/hyxxgl',
      name: 'hyxxgl',
      component: Layout,
      redirect: '/hyxxgl/hyzlgl',
      meta: { noCache: false, title: '会员信息管理', icon: 'icon-huiyuanguanli' },
      children: [
        { path: 'hyzlgl', component: _import('hyxxgl/hyzlgl'), name: "hyzlgl", meta: { title: '会员资料管理', icon: 'icon-danweiguanli', noCache: false } },
        { path: 'czmxcx', component: _import('hyxxgl/czmxcx'), name: "czmxcx", meta: { title: '充值明细查询', icon: 'icon-danweiguanli', noCache: false } },
        { path: 'xfmxcx', component: _import('hyxxgl/xfmxcx'), name: "xfmxcx", meta: { title: '消费明细查询', icon: 'icon-danweiguanli', noCache: false } }, { path: 'txmxcx', component: _import('hyxxgl/txmxcx'), name: "txmxcx", meta: { title: '提现明细查询', icon: 'icon-danweiguanli', noCache: true } }, { path: 'symxcx', component: _import('hyxxgl/symxcx'), name: "symxcx", meta: { title: '收益明细查询', icon: 'icon-danweiguanli', noCache: true } },
        { path: 'jfmxcx', component: _import('hyxxgl/jfmxcx'), name: 'jfmxcx', meta: { noCache: false, title: '积分明细查询', icon: 'icon-danweiguanli' } },
        { path: 'yhjmxcx', component: _import('hyxxgl/yhjmxcx'), name: 'yhjmxcx', meta: { noCache: false, title: '红包/优惠卷明细查询', icon: 'icon-danweiguanli' } },
      ]
    },
    //理财产品管理
    {
      path: '/flccpgl',
      name: 'flccpgl',
      component: Layout,
      redirect: '/flccpgl/lccpgl',
      meta: { noCache: false, title: '理财产品管理', icon: 'icon-caiwuguanli' },
      children: [
        { path: 'lccpcx', component: _import('flccpgl/lccpcx'), name: 'lccpcx', meta: { noCache: false, title: '理财产品查询', icon: 'example' } },
        { path: 'lccpgl', component: _import('flccpgl/lccpgl'), name: 'lccpgl', meta: { noCache: false, title: '理财产品管理', icon: 'example' } },
        { path: 'hyczsh', component: _import('flccpgl/hyczsh'), name: 'hyczsh', meta: { noCache: false, title: '会员充值审核', icon: 'example' } }
      ]
    },
    //权限管理
    {
      path: '/qxgl',
      name: 'qxgl',
      component: Layout,
      redirect: '/qxgl/yhxxgl',
      meta: { noCache: false, title: '权限管理', icon: 'icon-caiwuguanli' },
      children: [
        { path: 'yhxxgl', component: _import('qxgl/yhxxgl'), name: 'yhxxgl', meta: { noCache: false, title: '用户信息管理', icon: 'example' } },
        { path: 'role-manage', component: _import('qxgl/role/roleManagement'), name: 'roleManage', meta: { noCache: false, title: '角色管理', icon: 'example' } },
        // { path: 'add-role', component: _import('qxgl/role/addRole'), name: 'addRole', meta: { noCache: false, title: '添加角色', icon: 'example' } },
        { path: 'qxsz', component: _import('qxgl/qxsz'), name: 'adminManage', meta: { noCache: false, title: '管理员管理', icon: 'example' } },
        { path: 'zygl', component: _import('qxgl/zygl'), name: 'zygl', meta: { noCache: false, title: '资源管理', icon: 'example' } },
      ]
    },
  //消息管理
    {
      path:'/massage',
      component:Layout,
      redirect:'/massage/notice',
      name:'massage',
      meta: { noCache: false, title: '消息管理', icon: 'icon-caiwuguanli' },
      children:[
        {
          path: 'notice',
          name: 'notice',
          component: _import('massage/notice'),
          meta: {
            title: '公告管理',
            icon: 'notice'
          }
        },
        {
          path: 'massage-put',
          name: 'massagePut',
          component: _import('massage/massagePut'),
          meta: {
            title: '消息推送',
            icon: 'notice'
          }
        }
      ]
    },//公告管理
    //客服人员管理
    {
      path: '/kfrygl',
      name: 'kfrygl',
      component: Layout,
      redirect: '/kfrygl/kfryglc',
      meta: { noCache: false, title: '客服人员管理', icon: 'icon-caiwuguanli' },
      children: [
        { path: 'kfryglc', component: _import('kfrygl/kfryglc'), name: 'kfryglc', meta: { noCache: false, title: '客服人员管理', icon: 'icon-caiwuguanli' } },
      ]
    },
    //消息公告
    {
      path: '/xxgg',
      name: 'xxgg',
      component: Layout,
      redirect: '/xxgg/xxfb',
      meta: { noCache: false, title: '消息公告', icon: 'icon-xiaoxigonggao' },
      children: [
        { path: 'xxfb', component: _import('xxgg/xxfb'), name: 'xxfb', meta: { noCache: false, title: '消息发布', icon: 'example' } },
        { path: 'tsjy', component: _import('xxgg/tsjy'), name: 'tsjy', meta: { noCache: false, title: '投诉建议', icon: 'example' } }
      ]
    },
    //系统管理
    {
      path: '/xtgl',
      name: 'xtgl',
      component: Layout,
      redirect: '/xtgl/index',
      meta: { noCache: false, title: '系统管理', icon: 'icon-xitongguanli' },
      children: [
        // { path: 'index', name: 'index', component: _import('xtgl/index'), meta: { noCache: false, title: '系统管理', icon: 'icon-xitongguanli' } },
        { path: 'sjzd', name: 'sjzd', component: _import('xtgl/sjzd'), meta: { noCache: false, title: '数据字典', icon: 'icon-xitongguanli' } },
      ]
    },
    //渠道管理
    {
      path: '/qdgl',
      name: 'qdgl',
      component: Layout,
      meta: { noCache: false, title: '渠道管理', icon: 'icon-xitongguanli' },
      children: [{
        path: 'index',
        name: 'qdgl',
        component: _import('qdgl/index'),
        meta: { noCache: false, title: '渠道管理', icon: 'icon-qudaoguanli' }
      }]
    },
    //  会员提现审核
    {
      path: '/hytxsh',
      component: Layout,
      name: 'hytxsh',
      meta: { noCache: false, title: '会员提现审核', icon: 'icon-xitongguanli' },
      children: [{
        path: 'hytxsh',
        name: 'hytxsh',
        component: _import('hytxsh/hytxshc'),
        meta: { noCache: false, title: '会员提现审核', icon: 'icon-qudaoguanli' }
      }]
    },

    //
    // //登陆界面
    // { path: '/login', component: _import('login/index'), hidden: true, },
    //主页
]
import Layout from '@/views/layout/Layout'
//constantRouterMap包含系统用户所有的路由
export const constantRouterMap = [
  {
    path: '',
    component: Layout,
  },
  //登陆界面
  { path: '/login', component: _import('login/index'), hidden: true, },
  //主页
]
export default new Router({
  routes: constantRouterMap
})
