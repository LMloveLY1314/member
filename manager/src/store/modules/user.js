import { LoginByUsername, logout, GetUserInfo } from '@/api/login' //, ,
import { getSession, setSession, removeSession } from '@/utils/auth'
import request from '@/utils/request'

const user = {
  state: {
    user:{},
    menu:{},
    // token: getSession(),
    // name: '',
    // avatar: '',
    // roles: [],
    // routers: [],
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_MENU: (state, menu) => {
      state.menu = menu
    },
    // SET_TOKEN: (state, token) => {
    //   state.token = token
    // },
    // SET_NAME: (state, name) => {
    //   state.name = name
    // },
    // SET_AVATAR: (state, avatar) => {
    //   state.avatar = avatar
    // },
    // SET_ROLES: (state, roles) => {
    //   state.roles = roles;
    //   state.routers = roles;
    // }
  },
  actions: {
    //登录之后，使用store（全局状态管理）在浏览器存储登录的用户信息
    LoginByUsername({ commit, state }, userInfo) { // 登录、获取用户信息
      return new Promise((resolve, reject) => {
        //执行登录方法
        LoginByUsername(userInfo).then(response => {
          //设置用户信息到本地(转换成json字符串后才能在sessionStorage中正常存取)
          sessionStorage.setItem("user",JSON.stringify(response.data.user))
          commit('SET_USER', response.data.user);
          resolve(response);
        }).catch(error => {
          reject(error);
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout().then(response => {
          removeSession();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 获取用户信息，暂时只判断登录状态（浏览器存储用户信息和当前用户菜单）
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        //请求用户信息
        request({ url: 'card/initMenu.do', method: 'post', data: {} }).then(response => {
          // console.log(response);
          debugger;
          commit('SET_ROLES', response);
          resolve(response);
        }).catch(error => {
          reject(error);
        });
      });
    },
    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeSession()
        resolve()
      })
    }
  }
}

export default user
