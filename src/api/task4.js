import request from '@/utils/request'
import qs from 'qs'

// 获取安全评估检测任务
export function getTask(params) {
  return request({
    url: '/task4s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建安全评估检测任务
export function newTask(data) {
  return request({
    url: '/task4s/save',
    method: 'post',
    data
  })
}

// 安全评估的检测任务详情
export function detailTask(params) {
  return request({
    url: '/task4s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改安全评估的检测任务
export function updateTask(data) {
  return request({
    url: '/task4s/update',
    method: 'post',
    data
  })
}

// 删除安全评估的检测任务
export function deleteTask(params) {
  return request({
    url: '/task4s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取安全评估的检测任务的列表
export function getTaskList(params) {
  return request({
    url: '/task4s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取安全评估检测报告
export function generateReport(params) {
  return request({
    url: '/task4s/report',
    method: 'post',
    data: qs.stringify(params)
  })
}
