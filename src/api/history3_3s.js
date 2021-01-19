import request from '@/utils/request'
import qs from 'qs'

// 获取红外检测仪器列表
export function getInfraredList(params) {
  return request({
    url: '/history3_3s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取指定ID的红外检测仪器具体信息
export function getInfraredDetail(params) {
  return request({
    url: '/history3_3s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取指定id的红外设备测出的数据列表
export function getInfraredDevDataList(params) {
  return request({
    url: '/history3_3_2s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取指定ID的红外测试数据
export function getInfraredDevData(params) {
  return request({
    url: '/history3_3_2s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}
