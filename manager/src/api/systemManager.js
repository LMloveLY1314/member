import request from '@/utils/request'


/**
 * 获取角色信息，可根据角色名查询
 * @param params
 */
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'GET',
    params
  })
}
