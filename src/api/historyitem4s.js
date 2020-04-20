import request from '@/utils/request'
import qs from 'qs'

// 获取安全评估子项列表
export function getHistoryitem(params) {
  return request({
    url: '/historyitem4s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取安全评估子项详情
export function getHistoryitemDetail(params) {
  return request({
    url: '/historyitem4s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}
