import request from '@/utils/request'
// import Storage from '../util/storage'

/**
 * 会员管理
 * */

/**
 * @param
 * 查询会员列表
 * */
export function getMemberList(params) {
  return request({
    url: '/member/manager/list',
    method: 'get',
    loading: false,
    params
  })
}

//导出会员信息
export  function  exportMemberData(){
  return request({
    url: '/member/manager/export/data',
    method: 'get',
  })
}
