import Cookies from 'js-cookie'

const TokenKey = 'Token_Value'
const UserID = 'Token_ID'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserID() {
  return Cookies.get(UserID)
}

export function setUserID(userid) {
  return Cookies.set(UserID, userid)
}

export function removeUserID() {
  return Cookies.remove(UserID)
}
