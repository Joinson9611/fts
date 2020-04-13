import request from '@/utils/request'
import qs from 'qs'

/**
 * @Description: 获取建筑物列表
 * @Date: 2020/4/10
 **/
export function getBuildingInfoList(Params) {
  return request({
    url: '/building4s/index',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取建筑物列表(下拉菜单)
 * @Date: 2020/4/10
 **/
export function getBuildingList(params) {
  return request({
    url: '/building4s/index2',
    method: 'post',
    data: qs.stringify(params)
  })
}

/**
 * @Description: 删除指定ID建筑物
 * @Date: 2020/4/10
 **/
export function deleteBuildings(Params) {
  return request({
    url: '/building4s/delete',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 新建建筑物
 * @Date: 2020/4/10
 **/
export function addBuilding(Params) {
  return request({
    url: '/building4s/save',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 获取指定ID的建筑物信息
 * @Date: 2020/4/10
 **/
export function getBuildingInfo(Params) {
  return request({
    url: '/building4s/read',
    method: 'post',
    data: qs.stringify(Params)
  })
}

/**
 * @Description: 修改指定ID建筑物的信息
 * @Date: 2020/4/10
 **/
export function updateBuilding(Params) {
  return request({
    url: '/building4s/update',
    method: 'post',
    data: qs.stringify(Params)
  })
}
