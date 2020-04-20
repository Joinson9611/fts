import request from '@/utils/request'
import qs from 'qs'

// 获取安全评估子项列表
export function getProblem(params) {
  return request({
    url: '/problem4s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}
