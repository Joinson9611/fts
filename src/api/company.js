import request from '@/utils/request'
import qs from 'qs'

// 获取公司列表 项目信息下拉框使用
export function getCompany(params) {
  return request({
    url: '/companys/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 创建新公司
export function createCompany(params) {
  return request({
    url: '/companys/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取当前用户的公司列表
export function getCompanyByUser(params) {
  return request({
    url: '/companys/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}
// 公司页面获取公司列表
export function getCompanyInfoList(params) {
  return request({
    url: '/companys/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取公司详情
export function getCompanyDetail(params) {
  return request({
    url: '/companys/read',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除公司
export function deleteCompanys(params) {
  return request({
    url: '/companys/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 编辑信息
export function editCompany(params) {
  return request({
    url: '/companys/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

