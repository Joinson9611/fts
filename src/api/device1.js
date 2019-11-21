import request from '@/utils/request'
import qs from 'qs'

// 获取消防设施的设备
export function getDeviceFirefac(params) {
  return request({
    url: '/device1s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加消防设施的设备
export function addDeviceFirefac(params) {
  return request({
    url: '/device1s/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除消防设施的设备
export function deleteDeviceFirefac(params) {
  return request({
    url: '/device1s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改消防设施的设备
export function updateDeviceFirefac(params) {
  return request({
    url: '/device1s/update',
    method: 'post',
    data: qs.stringify(params)
  })
}
