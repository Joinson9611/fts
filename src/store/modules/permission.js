import { asyncRouterMap, constantRoutes } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles 用户登录返回的权限组
 * @param route 异步加载路由表中的单一路由项
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 *
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap 异步加载的路由表
 * @param roles 用户登录返回的权限组
 */
function filterAsyncRouter(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      // 递归生成子项目里的路由
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}

const permission = {

  state: {
    routers: constantRoutes,
    addRouters: [],
    roles: []
  },

  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRoutes.concat(routers)
    },
    REMOVE_ROUTERS: (state) => {
      state.addRouters = []
      state.routers = constantRoutes
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        // 生成用户能够访问的路由表
        const accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        // 存储路由表到本地
        commit('SET_ROUTERS', accessedRouters)
        commit('SET_ROLES', roles)
        resolve()
      })
    },

    RemoveRoutes({ commit }) {
      return new Promise(resolve => {
        // 存储路由表到本地
        commit('REMOVE_ROUTERS')
        resolve()
      })
    }
  }
}

export default permission
