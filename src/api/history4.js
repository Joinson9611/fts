import request from '@/utils/request'
import qs from 'qs'

// 获取安全评估检测记录
export function getHistory(params) {
  return request({
    url: '/history4s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取安全评估检测记录详情
export function getHistoryDetail(params) {
  return request({
    url: '/history4s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}
