import request from '@/utils/request'

export function LoginByUsername(data) {
  return request({
    url: 'sys/login',
    method: 'post',
    data
  });
}

export function logout() {
  return request({
    url: 'card/logout.do',
    method: 'post',
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
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

//
// export function getUserRolesPermissions(data) {
//   return request({
//     url: `admin/systems/roles/list`,
//     method: 'post',
//     data
//   })
// }

