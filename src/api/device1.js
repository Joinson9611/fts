import request from '@/utils/request'
import qs from 'qs'

// 获取设备
export function getDevice1(params) {
  return request({
    url: '/device1s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加设备
export function addDevice1(params) {
  return request({
    url: '/device1s/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除设备
export function deleteDevice1(params) {
  return request({
    url: '/device1s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 修改设备
export function updateDevice1(params) {
  return request({
    url: '/device1s/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 导入设备
export function importDevice1(params) {
  return request({
    url: '/device1s/import',
    method: 'post',
    data: params
  })
}

// 导出设备
export function exportDevice1(params) {
  return request({
    url: '/device1s/export',
    method: 'post',
    responseType: 'blob',
    data: qs.stringify(params)
  })
}
