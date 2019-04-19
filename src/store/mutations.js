export default {
  setState (state, { key, value }) {
    state[key] = value
  },
  setLoaded (state, loading) {
    state.loading = loading
  },
  setData (state, data) {
    state.data = data
  }
}
