import request from '@/utils/request'
import qs from 'qs'

// 获取消防设施检测记录
export function getHistoryFireFac(params) {
  return request({
    url: '/history1s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取消防设施检测记录详情
export function getHistoryDetail(params) {
  return request({
    url: '/history1s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

