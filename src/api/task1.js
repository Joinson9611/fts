import request from '@/utils/request'
import qs from 'qs'

// 获取消防设施的检测任务
export function getTaskFire(params) {
  return request({
    url: '/task1s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建检测任务
export function addTaskFire(data) {
  return request({
    url: '/task1s/save',
    method: 'post',
    data
  })
}

// 消防设施的检测任务详情
export function detailTaskFire(params) {
  return request({
    url: '/task1s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改消防设施的检测任务
export function updateTaskFire(data) {
  return request({
    url: '/task1s/update',
    method: 'post',
    data
  })
}

// 删除消防设施的检测任务
export function deleteTaskFire(params) {
  return request({
    url: '/task1s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取消防设施的检测任务的列表
export function getTaskList(params) {
  return request({
    url: '/task1s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取消防设施检测报告
export function generateReport(params) {
  return request({
    url: '/task1s/report',
    method: 'post',
    data: qs.stringify(params)
  })
}
