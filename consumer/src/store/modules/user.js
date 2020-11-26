import * as API_Login from '../../api/login';
import * as API_Consumer from  '../../api/consumer'
import Storage from '../../util/storage'
import jwt_decode from 'jwt-decode';



//保存用户状态
// state
const _user = Storage.getItem('consumer')
export const state = {
  user: _user ? JSON.parse(_user) : ''
}

// mutations
export const mutations = {
  /**
   * 设置用户信息
   * @param state
   * @param user
   * @constructor
   */
  SET_USER: (state, user) => {
    state.user = user
    const { expires } = user
    Storage.setItem('consumer', JSON.stringify(user), { expires })
    Storage.setItem('consumer_uid', user.user_id, { expires })
  },
  /**
   * 设置访问令牌
   * @param state
   * @param token
   * @constructor
   */
  SET_ACCESS_TOKEN: (state, token) => {
    const expires = new Date(jwt_decode(token).exp * 1000)
    Storage.setItem('consumer_access_token', token, { expires })
  },
  /**
   * 设置刷新令牌
   * @param state
   * @param token
   * @constructor
   */
  SET_REFRESH_TOKEN: (state, token) => {
    const expires = new Date(jwt_decode(token).exp * 1000)
    Storage.setItem('consumer_refresh_token', token, { expires })
    // 同时延长用户信息失效时间
    const user = Storage.getItem('consumer')
    const uid = Storage.getItem('consumer_id')
    Storage.setItem('consumer', user, { expires })
    Storage.setItem('consumer_id', uid, { expires })
  },
  /**
   * 移除用户信息
   * @param state
   * @constructor
   */
  REMOVE_USER: (state) => {
    state.user = ''
    Storage.removeItem('consumer')
    Storage.removeItem('consumer_id')
  },
  /**
   * 移除访问令牌
   * @param state
   * @constructor
   */
  REMOVE_ACCESS_TOKEN: (state) => {
    Storage.removeItem('consumer_access_token')
  },
  /**
   * 移除刷新令牌
   * @param state
   * @constructor
   */
  REMOVE_REFRESH_TOKEN: (state) => {
    Storage.removeItem('consumer_refresh_token')
  }
}

// actions
export const actions = {
  /**
   * 用户名登录
   * @param commit
   * @param params
   * @returns {Promise<any>}
   */
  loginAction({ commit }, params) {
    return new Promise((resolve, reject) => {
      API_Login.login(params).then(response => {
        const { access_token, refresh_token, ...user } = response
        const expires = new Date(jwt_decode(refresh_token).exp * 1000)
        commit('SET_USER', { ...user, expires })
        commit('SET_ACCESS_TOKEN', access_token)
        commit('SET_REFRESH_TOKEN', refresh_token)
        resolve()
      }).catch(reject)
    })
  },
  /**
   * 登出
   * @param dispatch
   * @param state
   * @returns {Promise<any>}
   */
  logoutAction({ dispatch }) {
    return new Promise((resolve, reject) => {
      API_Login.logout().then(() => {
        dispatch('fedLogoutAction')
        resolve()
      }).catch(reject)
    })
  },
  /**
   * 设置accessToken
   * @param commit
   * @param accessToken
   */
  setAccessTokenAction: ({ commit }, accessToken) => {
    commit('SET_ACCESS_TOKEN', accessToken)
  },
  /**
   * 设置refreshToken
   * @param commit
   * @param refreshToken
   */
  setRefreshTokenAction: ({ commit }, refreshToken) => {
    commit('SET_REFRESH_TOKEN', refreshToken)
  },
  /**
   * 前端退出
   * @param commit
   */
  fedLogoutAction: ({ commit }) => {
    commit('REMOVE_USER')
    commit('REMOVE_ACCESS_TOKEN')
    commit('REMOVE_REFRESH_TOKEN')
  },

  /**
   * 获取用户数据
   * @param commit
   * @param params
   */
  getUserDataAction: ({ commit }) => {
    return new Promise((resolve, reject) => {
      API_Consumer.getUserInfo().then(response => {
        commit('SET_USER', response)
        resolve(response)
      }).catch(error => reject(error))
    })
  },
}
