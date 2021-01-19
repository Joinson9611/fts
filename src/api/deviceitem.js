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

// 获取指设备类型（子项）下的所有检测项（项）的列表(电器检测)
export function getDeviceItems3(params) {
  return request({
    url: '/deviceitems/index3',
    method: 'post',
    data: qs.stringify(params)
  })
}
