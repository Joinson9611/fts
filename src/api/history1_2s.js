import request from '@/utils/request'
import qs from 'qs'

// 获取建筑防火检测记录
export function getHistoryFireList(params) {
  return request({
    url: '/history1_2s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取建筑防火检测记录详情
export function getHistoryFireDetail(params) {
  return request({
    url: '/history1_2s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}
