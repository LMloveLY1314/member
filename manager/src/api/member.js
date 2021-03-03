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

/**
 * @param
 * 添加会员
 * */
export function addMember(data) {
  return request({
    url:'/member/manager/add',
    method:'post',
    data
  })
}

/**
 * @param
 * 编辑会员
 * */
export function editMember(data) {
  //这里data如果换成params，请求参数格式会自动变成get形式，被坑了一下（原理没时间找了）
  return request({
    url: '/member/manager/edit',
    method: 'post',
    loading: false,
    data
  })
}

/**
 * @param
 * 禁用会员
 * */
export function disableMember(memberId) {
  return request({
    url: `/member/manager/disableMember/${memberId}`,
    method: 'get',
    loading: false,
  })
}

/**
 * 恢复会员
 * */
export function recoveryMember(memberId) {
  return request({
    url: `/member/manager/recoveryMember/${memberId}`,
    method: 'get',
    loading: false,
  })
}

/**
 * @param
 * 删除会员
 * */
export function deleteMember(memberId) {
  return request({
    url: `/member/manager/delete/${memberId}`,
    method: 'get',
    loading: false,
  })
}


//导出会员信息
export  function  exportMemberData(){
  return request({
    url: '/member/manager/export/data',
    method: 'get',
  })
}


//根据id获取会员详情
export  function  getByMemberId(param){
  return request({
    url: `/member/manager/getById/${param}`,
    method: 'get',
  })
}
