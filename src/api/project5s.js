import request from '@/utils/request'
import qs from 'qs'

// 获取三小场所检测任务
export function getProject(params) {
  return request({
    url: '/project5s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建三小场所检测任务
export function newProject(data) {
  return request({
    url: '/project5s/save',
    method: 'post',
    data
  })
}

// 三小场所的检测任务详情
export function detailProject(params) {
  return request({
    url: '/project5s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改三小场所的检测任务
export function updateProject(data) {
  return request({
    url: '/project5s/update',
    method: 'post',
    data
  })
}

// 删除三小场所的检测任务
export function deleteProject(params) {
  return request({
    url: '/project5s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取三小场所的检测任务的列表
export function getProjectList(params) {
  return request({
    url: '/project5s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取三小场所检测报告
export function generateReport(params) {
  return request({
    url: '/project5s/report',
    method: 'post',
    data: qs.stringify(params)
  })
}
