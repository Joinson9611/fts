import request from '@/utils/request'
import qs from 'qs'

// 用户登录接口
export function login(loginParams) {
  return request({
    url: '/users/logon',
    method: 'post',
    data: qs.stringify(loginParams)
  })
}

export function setUserInfo(params) {
  return request({
    url: '/users/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 用户信息获取接口
export function getInfo() {
  return request({
    url: '/users/getuserinfo',
    method: 'post'
  })
}

// 用户等级信息获取
export function getUserLevel() {
  return request({
    url: '/users/getuserinfo2',
    method: 'post'
  })
}

// 用户登出接口
export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}

// 获取执行人员列表
export function getExecutorList(params) {
  return request({
    url: '/users/getusersofproject',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 公司成员管理页面返回 用户列表
export function getCompanyMembers(params) {
  return request({
    url: '/users/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 公司成员管理页面新增 用户成员
export function addCompanyMember(params) {
  return request({
    url: '/users/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 公司成员管理页面删除 用户成员
export function deleteCompanyMember(params) {
  return request({
    url: '/users/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 公司成员管理 账号信息编辑
export function editCompanyMember(params) {
  return request({
    url: '/users/update2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取指定公司的项目成员 下拉框使用
export function getUsersByCompany(params) {
  return request({
    url: '/users/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}
