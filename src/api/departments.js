import request from '@/utils/request'
import qs from 'qs'

// 获取部门列表
export function getDepartments(params) {
  return request({
    url: '/departments/index',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 创建新部门
export function createDepartment(params) {
  return request({
    url: '/departments/save',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 删除部门
export function deleteDepartments(params) {
  return request({
    url: '/departments/delete',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 编辑部门信息
export function editDepartment(params) {
  return request({
    url: '/departments/update',
    method: 'post',
    data: qs.stringify(params)
  })
}

// 获取部门列表
export function getDepartmentsByCompany(params) {
  return request({
    url: '/departments/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}
