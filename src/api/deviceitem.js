import request from '@/utils/request'
import qs from 'qs'

// 获取消防设施的设备
export function getDeviceItems(params) {
  return request({
    url: '/deviceitems/index',
    method: 'post',
    data: qs.stringify(params)
  })
}
