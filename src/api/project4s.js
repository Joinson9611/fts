import request from '@/utils/request'
import qs from 'qs'

// 获取安全评估检测任务
export function getProject(params) {
  return request({
    url: '/project4s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建安全评估检测任务
export function newProject(data) {
  return request({
    url: '/project4s/save',
    method: 'post',
    data
  })
}

// 安全评估的检测任务详情
export function detailProject(params) {
  return request({
    url: '/project4s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改安全评估的检测任务
export function updateProject(data) {
  return request({
    url: '/project4s/update',
    method: 'post',
    data
  })
}

// 删除安全评估的检测任务
export function deleteProject(params) {
  return request({
    url: '/project4s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取安全评估的检测任务的列表
export function getProjectList(params) {
  return request({
    url: '/project4s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取安全评估检测报告
export function generateReport(params) {
  return request({
    url: '/project4s/report',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导出项目信息
export function exportTemp(params) {
  return request({
    url: '/project4s/export',
    method: 'post',
    responseType: 'blob',
    data: qs.stringify(params)
  })
}

// 导入项目信息
export function importTemp(params) {
  return request({
    url: '/project4s/import',
    method: 'post',
    data: params
  })
}
