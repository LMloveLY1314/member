// const TokenKey = 'token'

// export function setSession(token) {
//   return sessionStorage.setItem(TokenKey, token)
// }
//
// export function removeSession() {
//   return sessionStorage.removeItem(TokenKey);
// }

// export function getSession() {
//   return sessionStorage.getItem(TokenKey);
// }
export function setSession(key,data) {
  return sessionStorage.setItem(key, data)
}
export function removeSession(key) {
  return sessionStorage.removeItem(key);
}
export function getSession(key) {
  return sessionStorage.getItem(key);
}
