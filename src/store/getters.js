export default {
  // 传参的
  getDataById: (state) => (id) => {
    return state.data[id]
  },
  // 不传参的
  getData: (state) => {
    return state.data
  }
}
