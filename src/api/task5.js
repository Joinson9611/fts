import request from '@/utils/request'
import qs from 'qs'

// 获取三小场所检测任务
export function getTask(params) {
  return request({
    url: '/task5s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 新建三小检测任务
export function newTask(data) {
  return request({
    url: '/task5s/save',
    method: 'post',
    data
  })
}

// 消防设施的检测任务详情
export function detailTask(params) {
  return request({
    url: '/task5s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改三小场所的检测任务
export function updateTask(data) {
  return request({
    url: '/task5s/update',
    method: 'post',
    data
  })
}

// 删除三小场所的检测任务
export function deleteTask(params) {
  return request({
    url: '/task5s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取消防设施的检测任务的列表
export function getTaskList(params) {
  return request({
    url: '/task5s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取消防设施检测报告
export function generateReport(params) {
  return request({
    url: '/task5s/report',
    method: 'post',
    data: qs.stringify(params)
  })
}
