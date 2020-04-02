import Cookies from 'js-cookie'

const TokenKey = 'Token_Value'
const UserID = 'Token_ID'
const ProjectTypeId = 'project_type_id'
const ProjectId = 'project_id'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function getProjectTypeId() {
  return Cookies.get(ProjectTypeId)
}

export function setProjectTypeId(pid) {
  return Cookies.set(ProjectTypeId, pid)
}

export function getProjectId() {
  return Cookies.get(ProjectId)
}

export function setProjectId(pid) {
  return Cookies.set(ProjectId, pid)
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

