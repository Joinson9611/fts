import request from '@/utils/request'
import qs from 'qs'

// 获取系统列表
export function getSystemTypes(params) {
  return request({
    url: '/systemtypes/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}
