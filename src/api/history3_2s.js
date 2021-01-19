import request from '@/utils/request'
import qs from 'qs'

// 获取接地电阻列表
export function getHistory3_2s(params) {
  return request({
    url: '/history3_2s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取接地电阻详情
export function getHistory3_2sDetail(params) {
  return request({
    url: '/history3_2s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

