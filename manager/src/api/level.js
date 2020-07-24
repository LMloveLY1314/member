import request from '@/utils/request'
// import Storage from '../util/storage'

/**
 * 会员等级管理
 * */

/**
 * 获取等级列表
 * @param params
 * @returns {*}
 */
export function getLevelList(params) {
  // params.password = md5(params.password)
  return request({
    url: '/member/level/list',
    method: 'post',
    loading: false,
    params
  })
}

/**
 * 获取等级名称列表
 * */

export function  getLevelNameList() {
  return request({
    url:'/member/level/levelNameList',
    method:'get',
    loading:false,
  })

}

/**
 * 获取等级详情
 * */

export function  getLevelDetail(levelId) {
  return request({
    url:`/member/level/detail/${levelId}`,
    method:'get',
    loading:false,
  })

}
/**
 *删除等级
 * */
export  function  deleteLevel(levelId) {
  return request({
    url:`/member/level/delete/${levelId}`,
    method:'delete',
  })

}

/**
 *添加角色
 */

export function  addLevel(data) {
    return request({
      url:'/member/level/add',
      method:'post',
      data
    })
}

/**
* 修改角色
* @param data
*/
export function editLevel(levelId,data) {
  return request({
    url: `/member/level/edit/${levelId}`,
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data
  })
}

/**
 * 会员等级名称列表
 */
export function levelNameList() {
  return request({
    url: '/member/level/levelNameList',
    method: 'get',
  })
}
