import request from '@/utils/request'
import qs from 'qs'

// 获取电器检测检测任务
export function getProject(params) {
  return request({
    url: '/project3s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建电器检测检测任务
export function newProject(data) {
  return request({
    url: '/project3s/save',
    method: 'post',
    data
  })
}

// 电器检测的检测任务详情
export function detailProject(params) {
  return request({
    url: '/project3s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改电器检测的检测任务
export function updateProject(data) {
  return request({
    url: '/project3s/update',
    method: 'post',
    data
  })
}

// 删除电器检测的检测任务
export function deleteProject(params) {
  return request({
    url: '/project3s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取电器检测的检测任务的列表
export function getProjectList(params) {
  return request({
    url: '/project3s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取电器检测检测报告
export function generateReport(params) {
  return request({
    url: '/project3s/report',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导出项目信息
export function exportTemp(params) {
  return request({
    url: '/project3s/export',
    method: 'post',
    responseType: 'blob',
    data: qs.stringify(params)
  })
}

// 导入项目信息
export function importTemp(params) {
  return request({
    url: '/project3s/import',
    method: 'post',
    data: params
  })
}
