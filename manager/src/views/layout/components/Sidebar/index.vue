<template>
  <div>
    <div :class="{ 'titlesid': true,'hide':isCollapse}">
      <div class="logo">
        <span class="logo_prefix">四火</span>
        <span class="logo_suffix">会员管理系统</span>
      </div>
    </div>
    <scroll-bar>
      <el-menu mode="vertical" unique-opened :default-active="$route.path" :collapse="isCollapse" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
        <sidebar-item :routes="permission_routers"></sidebar-item>
      </el-menu>
    </scroll-bar>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'

export default {
  components: { SidebarItem, ScrollBar },
  data(){
    return{
      permission_routers: [
        //会员信息管理
        {
          path: '/hyxxgl',
          // path: '',
          name: 'hyxxgl',
          meta: { noCache: false, title: '会员信息管理', icon: 'icon-huiyuanguanli' },
          children: [
            { path: 'hyzlgl',  name: "hyzlgl", meta: { title: '会员资料管理', icon: 'icon-danweiguanli', noCache: false } },
            { path: 'czmxcx',  name: "czmxcx", meta: { title: '充值明细查询', icon: 'icon-danweiguanli', noCache: false } },
            { path: 'xfmxcx',  name: "xfmxcx", meta: { title: '消费明细查询', icon: 'icon-danweiguanli', noCache: false } }, { path: 'txmxcx',  name: "txmxcx", meta: { title: '提现明细查询', icon: 'icon-danweiguanli', noCache: true } }, { path: 'symxcx', name: "symxcx", meta: { title: '收益明细查询', icon: 'icon-danweiguanli', noCache: true } },
            { path: 'jfmxcx',  name: 'jfmxcx', meta: { noCache: false, title: '积分明细查询', icon: 'icon-danweiguanli' } },
            { path: 'yhjmxcx', name: 'yhjmxcx', meta: { noCache: false, title: '红包/优惠卷明细查询', icon: 'icon-danweiguanli' } },
          ]
        },
        //理财产品管理
        {
          path: '/flccpgl',
          name: 'flccpgl',
          meta: { noCache: false, title: '理财产品管理', icon: 'icon-caiwuguanli' },
          children: [
            { path: 'lccpcx', name: 'lccpcx', meta: { noCache: false, title: '理财产品查询', icon: 'example' } },
            { path: 'lccpgl', name: 'lccpgl', meta: { noCache: false, title: '理财产品管理', icon: 'example' } },
            { path: 'hyczsh',  name: 'hyczsh', meta: { noCache: false, title: '会员充值审核', icon: 'example' } }
          ]
        },
        //权限管理
        {
          path: '/qxgl',
          name: 'qxgl',
          meta: { noCache: false, title: '权限管理', icon: 'icon-caiwuguanli' },
          children: [
            { path: 'yhxxgl', name: 'yhxxgl', meta: { noCache: false, title: '用户信息管理', icon: 'example' } },
            { path: 'qxsz',  name: 'qxsz', meta: { noCache: false, title: '管理员管理', icon: 'example' } },
            { path: 'zygl', name: 'zygl', meta: { noCache: false, title: '资源管理', icon: 'example' } },
          ]
        },
        //客服人员管理
        {
          path: '/kfrygl',
          name: 'kfrygl',
          meta: { noCache: false, title: '客服人员管理', icon: 'icon-caiwuguanli' },
          children: [
            { path: 'kfryglc',  name: 'kfryglc', meta: { noCache: false, title: '客服人员管理', icon: 'icon-caiwuguanli' } },
          ]
        },
        //消息公告
        {
          path: '/xxgg',
          name: 'xxgg',
          meta: { noCache: false, title: '消息公告', icon: 'icon-xiaoxigonggao' },
          children: [
            { path: 'xxfb',  name: 'xxfb', meta: { noCache: false, title: '消息发布', icon: 'example' } },
            { path: 'tsjy',  name: 'tsjy', meta: { noCache: false, title: '投诉建议', icon: 'example' } }
          ]
        },
        //系统管理
        {
          path: '/xtgl',
          name: 'xtgl',
          meta: { noCache: false, title: '系统管理', icon: 'icon-xitongguanli' },
          children: [
            // { path: 'index', name: 'index', component: _import('xtgl/index'), meta: { noCache: false, title: '系统管理', icon: 'icon-xitongguanli' } },
            { path: 'sjzd', name: 'sjzd',  meta: { noCache: false, title: '数据字典', icon: 'icon-xitongguanli' } },
          ]
        },
      ]
    }
  },
  // computed: {
  //   ...mapGetters([
  //     'permission_routers',
  //     'sidebar'
  //   ]),
  //   isCollapse() {
  //     return !this.sidebar.opened;
  //   }
  // },
  created: function() {
    // console.log(this.permission_routers)
  },

}

</script>
<style lang="scss" scoped>
.titlesid {
  position: absolute;
  width: 100%;
  top: -60px;
  height: 60px; // margin-top: 10px;
  background: #545c64;
  padding: 20px 0px 10px 20px;
  box-shadow: 2px 0 3px rgba(0, 0, 0, .5);
  z-index: 1;
  .logo {
    float: left;
    cursor: pointer;
    font-size: 18px;
    .logo_prefix {
      color: #ffce40;
    }
    .logo_suffix {
      color: #fff;
    }
  }
}

.el-menu {
  margin-bottom: 100px;
}

div.hide {
  overflow: hidden;
  padding-left: 10px;
  padding-top: 10px;
}

</style>
