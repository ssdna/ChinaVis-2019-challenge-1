export default {
  getState: (state) => (key) => {
    return state[key]
  },
  // 传参的
  getDataById: (state) => (id) => {
    return state.data[id]
  },
  // 不传参的
  all: (state) => {
    return state
  }
}
