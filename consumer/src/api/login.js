import request from '../util/request'
import Storage from '../util/storage'
// import md5 from 'js-md5'

/**
 * 登录
 * @param params
 * @returns {*}
 */
export function login(params) {
  // params.password = md5(params.password)
  return request({
    url: 'consumer/passport/login',
    method: 'post',
    loading: false,
    params
  })
}

/**
 * 退出账户
 * @returns {*}
 */
export function logout() {
  return request({
    url: `admin/systems/admin-users/logout?uid=${Storage.getItem('consumer_id')}`,
    method: 'post'
  })
}

/**
 * 获取用户角色权限
 * @param role_id
 * @returns {*}
 */
export function getUserRolesPermissions(role_id) {
  return request({
    url: `admin/systems/roles/${role_id}/checked`,
    method: 'get'
  })
}
