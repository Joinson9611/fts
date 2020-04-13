import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import PlatformLayout from '@/views/platformlayout/PlatformLayout'
import projectLayout from '@/projectLayout'
import test from '@/views/login/index'
import report from '@/views/report/task'
/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/report/task',
    component: report,
    hidden: true
  },
  {
    path: '/login',
    component: test,
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: PlatformLayout,
    hidden: false,
    redirect: '/project',
    children: [{
      hidden: true,
      path: 'project',
      name: 'project',
      component: () => import('@/views/project')
    }, {
      hidden: true,
      path: 'mangment',
      name: 'mangment',
      component: () => import('@/views/mangment')
    }]
  },
  {
    path: '/project',
    hidden: true,
    component: projectLayout,
    children: [{
      path: 'project1',
      component: () => import('@/views/detection/project')
    }, {
      path: 'project4',
      component: () => import('@/views/security/project')
    }, {
      path: 'project5',
      component: () => import('@/views/establishments/project')
    }]
  },
  // {
  //   path: '/project4',
  //   hidden: true,
  //   component: projectLayout,
  //   children: [{
  //     path: 'info',
  //     component: () => import('@/views/security/project')
  //   }]
  // },
  // {
  //   path: '/project5',
  //   hidden: true,
  //   component: projectLayout,
  //   children: [{
  //     path: 'info',
  //     component: () => import('@/views/establishments/project')
  //   }]
  // },
  {
    path: '/projects',
    component: Layout,
    children: [{
      path: 'info',
      name: 'projectInfo',
      component: () => import('@/views/projectInfo'),
      meta: { title: '项目详情', icon: 'project' }
    }]
  },
  {
    path: '/test',
    component: () => import('@/views/test'),
    hidden: true
  }
]

export const asyncRouterMap = [
  {
    path: '/location1',
    component: Layout,
    redirect: 'noRedirect',
    name: 'Location',
    alwaysShow: true,
    meta: { title: '建筑管理', icon: 'location', roles: [1] },
    children: [
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/detection/location/building'),
        meta: { title: '建筑物', icon: 'building', roles: [1] }
      },
      {
        path: 'floor',
        name: 'Floor',
        meta: { title: '楼层', icon: 'floor', roles: [1] },
        component: () => import('@/views/detection/location/floor')
      }
    ]
  },
  {
    path: '/location4',
    component: Layout,
    // redirect: 'noRedirect',
    // name: 'Location',
    children: [
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/security/building'),
        meta: { title: '建筑物', icon: 'building', roles: [4] }
      }
    ]
  },
  {
    path: '/device1',
    component: Layout,
    hidden: false,
    children: [{
      path: 'administration',
      component: () => import('@/views/detection/device'),
      meta: { title: '设备管理', icon: 'devices', roles: [1] }
    }]
  },
  {
    path: '/fireFighting',
    component: Layout,
    hidden: false,
    children: [{
      path: 'record',
      component: () => import('@/views/detection/record'),
      meta: { title: '检测记录', icon: 'record', roles: [1] }
    }]
  },
  {
    path: '/fireFighting',
    component: Layout,
    redirect: 'noredirect',
    name: 'fireFighting',
    alwaysShow: true,
    meta: { title: '消防设施', icon: 'fireFighting', roles: [2] },
    children: [
      {
        path: 'device',
        name: 'device',
        component: () => import('@/views/detection/device'),
        meta: { title: '设备管理', icon: 'devices', roles: [2] }
      },
      {
        path: 'record',
        name: 'record',
        meta: { title: '检测记录', icon: 'record', roles: [2] },
        component: () => import('@/views/detection/record')
      }
    ]
  },

  // {
  //   path: '/security',
  //   component: Layout,
  //   redirect: 'noredirect',
  //   name: 'security',
  //   alwaysShow: true,
  //   meta: { title: '安全评估', icon: 'security', roles: [4] },
  //   children: [
  //     {
  //       path: 'record',
  //       name: 'record',
  //       meta: { title: '评估记录', icon: 'record', roles: [4] },
  //       component: () => import('@/views/security/record')
  //     }
  //   ]
  // },
  {
    path: '/establishments',
    component: Layout,
    redirect: 'noredirect',
    name: 'establishments',
    alwaysShow: true,
    meta: { title: '三小场所', icon: 'establishments', roles: [5] },
    children: [
      {
        path: 'record',
        name: 'record',
        meta: { title: '检测记录', icon: 'record', roles: [5] },
        component: () => import('@/views/establishments/record')
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
