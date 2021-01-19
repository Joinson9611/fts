import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import PlatformLayout from '@/views/platformlayout/PlatformLayout'
import projectLayout from '@/projectLayout'
import test from '@/views/login/index'
import report from '@/views/report/project'
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
    path: '/report/project',
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
    },
    {
      path: 'project3',
      component: () => import('@/views/electricaldetection/project')
    },
    {
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
  {
    path: '/project5',
    hidden: true,
    component: projectLayout,
    children: [{
      path: 'info',
      component: () => import('@/views/establishments/project')
    }]
  },
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
  // 设施检测
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
    meta: { title: '检测记录', icon: 'record', roles: [1] },
    hidden: false,
    children: [{
      path: 'facilities',
      component: () => import('@/views/detection/record/facilities'),
      meta: { title: '设施检测', icon: 'facilities', roles: [1] }
    }, {
      path: 'fireprevention',
      component: () => import('@/views/detection/record/fireprevention'),
      meta: { title: '建筑防火', icon: 'fireprevention', roles: [1] }
    }]
  },

  // 安全评估
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
    path: '/security',
    component: Layout,
    hidden: false,
    children: [{
      path: 'record',
      component: () => import('@/views/security/record'),
      meta: { title: '评估记录', icon: 'record', roles: [4] }
    }]
  },
  {
    path: '/problems',
    component: Layout,
    hidden: false,
    children: [{
      path: 'problem',
      component: () => import('@/views/security/problem'),
      meta: { title: '问题', icon: 'problem', roles: [4], is_problem: 1 }
    }]
  },
  {
    path: '/suggestions',
    component: Layout,
    hidden: false,
    children: [{
      path: 'suggestion',
      component: () => import('@/views/security/problem'),
      meta: { title: '建议', icon: 'suggestion', roles: [4], is_problem: 0 }
    }]
  },
  // 电器检测
  {
    path: '/checkItem',
    component: Layout,
    name: 'checkItem',
    alwaysShow: false,
    children: [{
      path: 'item',
      component: () => import('@/views/electricaldetection/checkItem'),
      meta: { title: '检测记录', icon: 'checkItem', roles: [3] }
    }]
  },
  {
    path: '/resistanceground',
    component: Layout,
    name: 'resistanceground',
    alwaysShow: false,
    children: [{
      path: 'resistance',
      component: () => import('@/views/electricaldetection/resistanceground'),
      meta: { title: '接地电阻', icon: 'resistance', roles: [3] }
    }]
  },
  {
    path: '/sceneimage',
    component: Layout,
    name: 'sceneimage',
    alwaysShow: false,
    children: [{
      path: 'image',
      component: () => import('@/views/electricaldetection/sceneimage'),
      meta: { title: '现场图片', icon: 'image', roles: [3] }
    }]
  },
  {
    path: '/infrareddetection',
    component: Layout,
    name: 'infrareddetection',
    alwaysShow: false,
    children: [{
      path: 'infrared',
      component: () => import('@/views/electricaldetection/infrareddetection'),
      meta: { title: '红外检测', icon: 'infrared', roles: [3] }
    }]
  },
  {
    path: '/instrumentationdetection',
    component: Layout,
    name: 'instrumentationdetection',
    alwaysShow: false,
    children: [{
      path: 'instrumentation',
      component: () => import('@/views/electricaldetection/instrumentation'),
      meta: { title: '检测仪器', icon: 'instrumentation', roles: [3] }
    }]
  },
  {
    path: '/aftercurrent',
    component: Layout,
    name: 'aftercurrent',
    alwaysShow: false,
    children: [{
      path: 'current',
      component: () => import('@/views/electricaldetection/aftercurrent'),
      meta: { title: '剩余电流', icon: 'aftercurrent', roles: [3] }
    }]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export const createRouter = () => new Router({
  // mode: 'history',
  // require service support
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
