import request from '@/utils/request'
import qs from 'qs'

// 获取电器检测检查项列表
export function getCheckItemList(params) {
  return request({
    url: '/history3s/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 读取指定ID的电气检测检查项信息（子项）
export function getCheckItemByID(params) {
  return request({
    url: '/history3s/read',
    method: 'post',
    data: qs.stringify(params)
  })
}
