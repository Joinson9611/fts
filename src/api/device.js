import request from '@/utils/request'
import qs from 'qs'

// 获取指定系统的所有设备类型（设施检测）
export function getDeviceTypes(params) {
  return request({
    url: '/devicetypes/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取指定系统的所有设备类型（电器检测）
export function getDeviceTypes3(params) {
  return request({
    url: '/devicetypes/index3',
    method: 'post',
    data: qs.stringify(params)
  })
}

