import request from '@/utils/request'

export function LoginByUsername(data) {
  // const data = {
  //   username,
  //   password
  // }
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
