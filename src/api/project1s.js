import request from '@/utils/request'
import qs from 'qs'

// 获取消防设施的检测项目
export function getProjectFire(params) {
  return request({
    url: '/project1s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建检测项目
export function addProjectFire(data) {
  return request({
    url: '/project1s/save',
    method: 'post',
    data
  })
}

// 消防设施的检测项目详情
export function detailProjectFire(params) {
  return request({
    url: '/project1s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改消防设施的检测项目
export function updateProjectFire(data) {
  return request({
    url: '/project1s/update',
    method: 'post',
    data
  })
}

// 删除消防设施的检测项目
export function deleteProjectFire(params) {
  return request({
    url: '/project1s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取消防设施的检测项目的列表
export function getProjectList(params) {
  return request({
    url: '/project1s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取消防设施检测报告
export function generateReport(params) {
  return request({
    url: '/project1s/report',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导出项目信息
export function exportTemp(params) {
  return request({
    url: '/project1s/export',
    method: 'post',
    responseType: 'blob',
    data: qs.stringify(params)
  })
}

// 导入项目信息
export function importTemp(params) {
  return request({
    url: '/project1s/import',
    method: 'post',
    data: params
  })
}
