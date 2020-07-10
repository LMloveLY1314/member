import { asyncRouterMap, constantRouterMap } from '@/router'
import  * as API_Login from '@/api/login'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {

  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.indexOf(role) >= 0)
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * names为用户具有的路由名称数组，与前段定义的路由做对比，筛选出有权限的路由
 * @param asyncRouterMap
 * @param names
 */
function filterAsyncRouter(asyncRouterMap, names) {
  const _routers = []
  //遍历
  asyncRouterMap.filter(item => {
    if (names.includes(item.name)) {
      // console.log(item.name)
      if (item.children) {
        item.children = filterAsyncRouter(item.children, names)
      }
    // console.log(item)
      _routers.push(item)
    }
  })
  return _routers
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    //routers为当前登录用户的路由
    SET_ROUTERS: (state, routers) => {
      // console.log( "初始"+state.addRouters)
      //这里赋值成功了，但addRouters时没有取到
      state.addRouters = routers
      // console.log( state.addRouters)
        //concat() 方法用于连接两个或多个数组，两个路由数据构建成一个
        state.routers = constantRouterMap.concat(routers)
      }
    },
    actions: {
      //访问一个路径时构建路由
      GenerateRoutes({ commit }, data) {
        //先判断是否在本地存有路由
        let user =sessionStorage.getItem("user")
        user = JSON.parse(user)
        return new Promise((resolve, reject) => {
          API_Login.getUserRolesPermissions(user.roleId).then(response => {
            // response = ["goods","goodsList","goodsSetting","categoryList","brandList","specList","goodsAudit","order","orderList","refundList","collectionList","receiptHistory","member","memberManage","memberList","memberRecycle","goodsComment","mgoodsCommentList","goodsAskList","memberNotification","notificationHistory","shop","shopManage","shopList","shopAudit","settlementManage","settlement","promotions","groupBuyManage","groupBuyList","groupBuyCategory","pointsMallManage","pointsClassify","pointsGoods","seckillManage","seckillList","page","pcDecoration","pcFloorManage","pcFocusManage","mobileDecoration","mobileFloorManage","mobileFocusManage","pageSetting","pcSiteMenu","mobileSiteMenu","hotKeyword","statistics","memberAnalysis","orderAmount","addedMember","goodsStatistics","priceSales","hotGoods","goodsSalesDetails","goodsCollect","trafficAnalysis","trafficAnalysisShop","trafficAnalysisGoods","otherStatistics","orderStatistics","salesRevenueStatistics","regionalAnalysis","customerPriceDistribution","refundStatistics","setting","paymentAndDelivery","paymentSettings","expressSettings","regionalManagementSettings", "memberGrade", "maintenance", "maintenanceList", "courseList", "guarantee", "guaranteeList","activity","activityList", "guaranteeDetail"];
            //筛选出有权限的路径，即筛选出该角色具有的权限
            // console.log("前端定义路由"+asyncRouterMap)
            let accessedRouters = filterAsyncRouter(asyncRouterMap, response);
            console.log("筛选路由"+accessedRouters)
            //再设置权限，做到不同角色的权限控制
            commit('SET_ROUTERS', accessedRouters)
            resolve()
          }).catch(reject)
        // }
      })
      // return new Promise(resolve => {
      //   const { roles } = data
      //   let accessedRouters
      //   if (roles.indexOf('admin') >= 0) {
      //     accessedRouters = asyncRouterMap
      //   } else {
      //     accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
      //   }
      //   commit('SET_ROUTERS', accessedRouters)
      //   resolve()
      // })
    }
  }
}

export default permission
