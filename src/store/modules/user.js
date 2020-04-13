import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserID, removeUserID, getUserID, getProjectTypeId, setProjectTypeId, getProjectId, setProjectId } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import md5 from '@/utils/md5'

const state = {
  token: getToken(),
  user_id: getUserID(),
  name: '',
  avatar: '',
  user_name: '',
  selected_project_id: getProjectId(),
  project_type_id: getProjectTypeId(),
  level: undefined,
  project_name: '',
  roles: []
}
const mutations = {
  SET_USER_ID: (state, userId) => {
    state.user_id = userId
  },
  SET_SELECTED_PROJECT_ID: (state, project_id) => {
    state.selected_project_id = project_id
  },
  SET_PROJECT_TYPE_ID: (state, project_type_id) => {
    state.project_type_id = project_type_id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USER_NAME: (state, user_name) => {
    state.user_name = user_name
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_LEVEL: (state, level) => {
    state.level = level
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_SELECTED_PROJECT_NAME: (state, project_name) => {
    state.project_name = project_name
  },
  SET_COMPANY_ID: (state, cid) => {
    state.company_id = cid
  },
  SET_USER_IMAGE: (state, image) => {
    state.user_image = image
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ user_name: username.trim(), user_password: md5.hexMD5(password + 'alarm_salt') }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        commit('SET_USER_ID', data.user_id)
        setUserID(data.user_id)
        setToken(data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { nickname, level, user_id, company_id, user_name } = data
        commit('SET_USER_IMAGE', `${process.env.VUE_APP_FILE_API}/image/user_head/${user_id}.jpg`)
        commit('SET_COMPANY_ID', company_id)
        commit('SET_USER_NAME', user_name)
        commit('SET_LEVEL', level)
        commit('SET_NAME', nickname)
        commit('SET_ROLES', [])
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 用于权限验证
  getInfo2({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        if (!data) {
          reject('验证失败，请重新登录')
        }
        const { nickname, company_id, user_id } = data
        commit('SET_USER_IMAGE', `${process.env.VUE_APP_FILE_API}/image/user_head/${user_id}.jpg`)
        commit('SET_COMPANY_ID', company_id)
        // commit('SET_ROLES', [level])
        commit('SET_SELECTED_PROJECT_ID', Cookies.get('project_id'))
        commit('SET_NAME', nickname)
        let roles = []
        const project_type_id = Cookies.get('project_type_id')
        if (project_type_id === '1') {
          roles = [1]
        } else if (project_type_id === '4') {
          roles = [4]
        }
        commit('SET_ROLES', roles)
        resolve(roles)
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 项目选择
  SelectProject({ commit }, id) {
    return new Promise(resolve => {
      setProjectId(id)
      commit('SET_SELECTED_PROJECT_ID', id)
      resolve()
    })
  },

  // 项目类型选择
  selectProjectType({ commit }, pid) {
    return new Promise(resolve => {
      commit('SET_PROJECT_TYPE_ID', pid)
      setProjectTypeId(pid)
      resolve()
    })
  },

  // 重选项目
  reelectProject({ commit }) {
    return new Promise(resolve => {
      Cookies.set('project_id', '')
      commit('SET_SELECTED_PROJECT_ID', '')
      resolve()
    })
  },

  // 重选项目类型
  reelectProjectType({ commit }) {
    return new Promise(resolve => {
      Cookies.set('project_type_id', '')
      commit('SET_PROJECT_TYPE_ID', '')
      resolve()
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_USER_ID', '')
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // 前端 登出
  FedLogOut({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_USER_ID', '')
      removeToken()
      removeUserID()
      resolve()
    })
  },
  // remove token
  resetToken({ commit, rootState }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      rootState.permission.addRouters = []
      removeToken()
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

