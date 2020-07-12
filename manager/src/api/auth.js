import request from '@/utils/request'
// import Storage from '../util/storage'

/**
 * 权限管理
 * */

/**
 * 获取管理员列表
 * @param params
 * @returns {*}
 */
export function getAdminList(params) {
  // params.password = md5(params.password)
  return request({
    url: 'admin/system/admin-manage/list',
    method: 'post',
    loading: false,
    params
  })
}

/**
 * 获取角色集合
 * */

export function  getRoleList(params) {
  return request({
    url:'admin/systems/roles/list',
    method:'post',
    loading:false,
    params
  })

}

/**
 * 获取所有角色
 * */

export function  getRoleAll() {
  return request({
    url:'admin/systems/roles/all',
    method:'post',
    loading:false,
  })

}
/**
 *删除角色
 * */
export  function  deleteRole(id) {
  return request({
    url:`admin/systems/roles/delete/${id}`,
    method:'delete',
  })

}

/**
 *添加角色
 */

export function  addRole(data) {
    return request({
      url:'admin/systems/roles/add',
      method:'post',
      data
    })
}
/**
 * 获得角色详情
 * */
export  function  getRole(id) {
  return request({
    url:`admin/systems/roles/get/${id}`,
    method:'get',
  })
}

/**
* 修改角色
* @param data
*/
export function editRole(id,data) {
  return request({
    url: `admin/systems/roles/edit/${id}`,
    method: 'post',
    // headers: { 'Content-Type': 'application/json' },
    data
  })
}

/**
 * 退出账户
 * @returns {*}
 */
export function logout() {
  return request({
    url: `admin/systems/admin-users/logout?uid=${sessionStorage.getItem('admin_uid')}`,
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

/**
 * 获取管理员详情
*/
export function getAdminUser(id) {
  return request({
    url: `admin/system/admin-manage/${id}`,
    method: 'get'
  })
}

/**
 * 删除管理员
 */
export function deleteAdminUser(id) {
  return request({
    url: `admin/system/admin-manage/delete/${id}`,
    method: 'get'
  })
}

/**
 * 编辑或添加管理员
 */
export function addAdminUser(params) {
  return request({
    url: `admin/system/admin-manage/edit`,
    method: 'post',
    params
  })
}

