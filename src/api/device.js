import request from '@/utils/request'
import qs from 'qs'

// 获取设备列表
export function getDeviceTypes(params) {
  return request({
    url: '/devicetypes/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}
