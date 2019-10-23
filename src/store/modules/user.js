import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, setUserID } from '@/utils/auth'
import { resetRouter } from '@/router'
import md5 from '@/utils/md5'

const state = {
  token: getToken(),
  name: '',
  avatar: ''
}

const mutations = {
  SET_USER_ID: (state, userId) => {
    state.userId = userId
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

        const { user_name, level } = data
        commit('SET_LEVEL', level)
        commit('SET_NAME', user_name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_USER_ID', '')
        commit('SET_TOKEN', '')
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
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

