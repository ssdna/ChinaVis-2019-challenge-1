import Vue from 'vue'
import Vuex from 'vuex'

import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  state: {
    loading: true,
    lastPointsNum: 0,
    timestamp: 24000,
    currentLog: {},
    auto: false,
    ratio: 24,
    data: {}
  },
  getters,
  mutations,
  actions,

  strict: debug
})
