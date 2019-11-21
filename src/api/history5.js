import request from '@/utils/request'
import qs from 'qs'

// 获取三小场所报告
export function getHistoryReport(params) {
  return request({
    url: '/history5s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取三小场所检测记录
export function getHistory(params) {
  return request({
    url: '/history5s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取三小场所检测记录详情
export function getHistoryDetail(params) {
  return request({
    url: '/history5s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取三小场所检测项
export function getDeviceItems(params) {
  return request({
    url: '/deviceitems/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

