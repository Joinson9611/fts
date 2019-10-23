import request from '@/utils/request'
import qs from 'qs'

export function getProjectList(params) {
  return request({
    url: '/projects/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

export function addProject(params) {
  return request({
    url: '/projects/save',
    method: 'post',
    data: qs.stringify(params)
  })
}
