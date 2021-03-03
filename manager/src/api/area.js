import request from '@/utils/request'

/**
 * 地区管理
 * */

// 获取区域
export function getAreaList(params) {
  return request({
    url: '/area/getArrList',
    method: 'get',
    params
  })
}
