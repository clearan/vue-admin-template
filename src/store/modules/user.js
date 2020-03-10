import {get,patch} from '@/utils/request'
import Vue from 'vue'
import qs from "qs";
const getDefaultState = () => {
  return {
    per:[],
    config:[],
    bank:[],
  }
}

const state = getDefaultState()

const mutations = {

  SET_PER: (state, per) => {
    state.per = per
  },

  SET_Config: (state, config) => {
    state.config = config
  },

  SET_Bank: (state, bank) => {
    state.bank = bank
  },

}

const actions = {

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
      get(`${Vue.prototype.url}/config`).then(response => {
        if (response.code === 200) {
          commit('SET_Config', response.data)
          resolve(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  getBankList({ commit }) {
    return new Promise((resolve, reject) => {
      get(`${Vue.prototype.url}/site_bank`).then(response => {
        if (response.code === 200) {
          commit('SET_Bank', response.data)
          resolve(response.data)
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

