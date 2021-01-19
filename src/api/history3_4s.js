import request from '@/utils/request'
import qs from 'qs'

// 获取现场图片列表
export function getHistory3_4s(params) {
  return request({
    url: '/history3_4s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取现场图片详情
export function getHistory3_4sDetail(params) {
  return request({
    url: '/history3_4s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

