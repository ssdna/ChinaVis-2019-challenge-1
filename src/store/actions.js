import { parseCSV, hashById, findMaxTimeRange } from '../utils/util'

export default {
  setState ({ state, commit }, { key, value }) {
    commit('setState', { key, value })
  },
  loadCSVData ({ state, commit }, file) {
    fetch(`public/csv/${file}`)
      .then(res => res.text())
      .then(csv => parseCSV(csv))
      .then(json => {
        commit('setLoaded', false)
        window.data = hashById(json)
        window.params = {
          ...findMaxTimeRange(window.data)
        }
        window.originData = json
      })
  }
}
