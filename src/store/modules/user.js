import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserID } from '@/utils/auth'
import { resetRouter } from '@/router'
import md5 from '@/utils/md5'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  selected_project_id: undefined,
  userId: undefined,
  level: undefined,
  project_name: '',
  roles: []
}

const mutations = {
  SET_USER_ID: (state, userId) => {
    state.userId = userId
  },
  SET_SELECTED_PROJECT_ID: (state, project_id) => {
    state.selected_project_id = project_id
  },
  SET_TOKEN: (state, token) => {
    state.token = token
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
        const { nickname, level } = data
        commit('SET_LEVEL', level)
        commit('SET_NAME', nickname)
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
        const { nickname, level, selected_project_id, company_id } = data
        commit('SET_COMPANY_ID', company_id)
        commit('SET_ROLES', [level])
        commit('SET_SELECTED_PROJECT_ID', selected_project_id)
        commit('SET_NAME', nickname)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 存储选择的项目id
  SelectProject({ commit }, info) {
    return new Promise(resolve => {
      commit('SET_SELECTED_PROJECT_ID', info.project_id)
      commit('SET_SELECTED_PROJECT_NAME', info.name)
      commit('SET_ROLES', [])
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

