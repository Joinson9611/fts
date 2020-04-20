import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/report/project'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  // start progress bar
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/home' })
      NProgress.done()
    } else if (['/home', '/project', '/mangment', '/project/project1', '/project/project2', '/project/project3', '/project/project4', '/project/project5'].includes(to.path)) {
      store.dispatch('user/getInfo').then(() => { // 拉取用户信息
        next()
      }).catch(error => {
        // remove token and go to login page to re-login
        store.dispatch('user/resetToken')
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      })
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('user/getInfo2').then((roles) => { // 拉取用户信息
          // 根据roles权限生成可访问的路由表
          store.dispatch('GenerateRoutes', { roles }).then(() => {
          // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)
            // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
            next({ ...to, replace: true })
          }).catch(error => {
          // remove token and go to login page to re-login
            store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          })
        }).catch((error) => {
          // remove token and go to login page to re-login
          store.dispatch('user/resetToken')
          Message.error('验证失败，请重新登录。')
          console.log(error)
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
