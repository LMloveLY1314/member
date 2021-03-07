import request from '@/utils/request'
// import Storage from '../util/storage'

/**
 *管理员首页
 * */

/**
 * 获取最近新增5个会员
 * @param params
 * @returns {*}
 */
export function getNewMemberList() {
  return request({
    url: '/admin/index/member',
    method: 'get',
    loading: false,
  })
}

/**
 * 获取会员性别占比
 * */

export function  getSexProportion() {
  return request({
    url:'/admin/index/sexProportion',
    method:'get',
    loading:false,
  })

}

/**
 * 获取会员年龄段占比
 * */

export function  getAgeProportion() {
  return request({
    url:'/admin/index/ageProportion',
    method:'get',
    loading:false,
  })

}

/**
 * 获取会员地区占比
 * */

export function  getRegionProportion() {
  return request({
    url:'/admin/index/regionProportion',
    method:'get',
    loading:false,
  })

}
/**
 * 获取会员等级占比
 * */

export function  getLevelProportion() {
  return request({
    url:'/admin/index/levelProportion',
    method:'get',
    loading:false,
  })

}


/**
 * 获取本年度每月会员增长趋势
 * */

export function  memberGrowthTrend(params) {
  return request({
    url: '/admin/index/memberGrowthTrend',
    method: 'get',
    loading: false,
    params
  })
}

/**
 * 各地区各级别会员数量
 */
export function  areaCountByLevel(params) {
  return request({
    url: '/admin/index/areaCountByLevel',
    method: 'get',
    loading: false,
    params
  })
}
