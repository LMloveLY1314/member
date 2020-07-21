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
 * 获取会员性别占比
 * */

export function  getLevelDetail(levelId) {
  return request({
    url:`/member/level/detail/${levelId}`,
    method:'get',
    loading:false,
  })

}
