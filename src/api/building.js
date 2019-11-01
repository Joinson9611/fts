import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取建筑物列表
 * @Date: 2019/6/27
 **/
export function getBuildingInfoList(Params) {
  return request({
    url: '/buildings/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取建筑物列表(下拉菜单)
 * @Date: 2019/6/27
 **/
export function getBuildingList(params) {
  return request({
    url: '/buildings/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 删除指定ID建筑物
 * @Date: 2019/6/27
 **/
export function deleteBuildings(Params) {
  return request({
    url: '/buildings/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 新建建筑物
 * @Date: 2019/6/27
 **/
export function addBuilding(Params) {
  return request({
    url: '/buildings/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取指定ID的建筑物信息
 * @Date: 2019/6/27
 **/
export function getBuildingInfo(Params) {
  return request({
    url: '/buildings/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改指定ID建筑物的信息
 * @Date: 2019/6/27
 **/
export function updateBuilding(Params) {
  return request({
    url: '/buildings/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
