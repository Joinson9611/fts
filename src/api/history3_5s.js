import request from '@/utils/request'
import qs from 'qs'

// 获取剩余电流列表
export function getAftercurrentList(params) {
  return request({
    url: '/history3_5s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取指定id剩余电流保护装置数据具体数据
export function getAftercurrentInfo(params) {
  return request({
    url: '/history3_5s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

