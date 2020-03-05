import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import {get,patch} from '@/utils/request'
import Vue from 'vue'
import qs from "qs";
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    per:[],
    config:[]
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
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

  SET_PER: (state, per) => {
    state.per = per
  },

  SET_Config: (state, config) => {
    state.config = config
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
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
          reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  getAdminPer({ commit }) {
    return new Promise((resolve, reject) => {
      let data = {
        parent_id:1,
        request_param:'GET'
      }
      get(`${Vue.prototype.url}/admin_permission`,data).then(response => {
        if (response.code === 200) {
          commit('SET_PER', response.data)
          resolve(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  getOtherPer({ commit }) {
    return new Promise((resolve, reject) => {
      let data = {
        request_param:'PATCH'
      }
      patch(`${Vue.prototype.url}/admin`,qs.stringify(data)).then(response => {
        if (response.code === 200) {
          commit('SET_PER', response.data)
          resolve(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  getConfig({ commit }) {
    return new Promise((resolve, reject) => {
      get(`${Vue.prototype.url}/site_config`).then(response => {
        if (response.code === 200) {
          commit('SET_Config', response.data)
          resolve(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
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

