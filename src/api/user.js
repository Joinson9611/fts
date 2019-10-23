import request from '@/utils/request'
import qs from 'qs'

export function login(params) {
  return request({
    url: '/users/logon',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function getInfo(params) {
  return request({
    url: '/users/getuserinfo',
    method: 'post',
    params: qs.stringify(params)
  })
}

export function logout() {
  return request({
    url: '/users/logout',
    method: 'post'
  })
}
