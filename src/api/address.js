import request from '@/utils/request'
import qs from 'qs'

// 获取省级列表
export function getProvinces(params) {
  return request({
    url: '/addresss/provinceindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取市级列表
export function getCities(params) {
  return request({
    url: '/addresss/cityindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取市级区级
export function getDistricts(params) {
  return request({
    url: '/addresss/districtindex',
    method: 'post',
    data: qs.stringify(params)
  })
}

