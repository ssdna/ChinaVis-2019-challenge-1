import { parseCSV, hashById } from '../utils/util'

export default {
  setState ({ state, commit }, { key, value }) {
    commit('setState', { key, value })
  },
  loadJSONData ({ state, commit }) {
    fetch('public/json/log-day2.json')
      .then(res => res.json())
      .then(json => {
        commit('setLoaded', false)
        window.data = hashById(json)
        window.originData = json
      })
  },
  loadCSVData ({ state, commit }, file) {
    fetch(`public/csv/${file}`)
      .then(res => res.text())
      .then(csv => parseCSV(csv))
      .then(json => {
        commit('setLoaded', false)
        window.data = hashById(json)
        window.originData = json
      })
  }
}
