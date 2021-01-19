import request from '@/utils/request'
import qs from 'qs'

// 获取检测仪器列表
export function getInstrumentList(params) {
  return request({
    url: '/instrumentation3s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取检测仪器信息
export function getInstrumentInfo(params) {
  return request({
    url: '/instrumentation3s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 添加检测仪器信息
export function addInstrument(params) {
  return request({
    url: '/instrumentation3s/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 编辑检测仪器信息
export function updateInstrument(params) {
  return request({
    url: '/instrumentation3s/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除检测仪器信息
export function deleteInstrument(params) {
  return request({
    url: '/instrumentation3s/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}
