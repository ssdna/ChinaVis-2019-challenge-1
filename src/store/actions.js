export default {
  async loadJSONData ({ state, commit }) {
    const json = await fetch('public/json/log-day3.json')
    const data = await json.json()

    commit('setLoaded', false)

    let global = {}
    for (let i = 0, last = data[0], tmp = []; i < data.length; i++) {
      const cur = data[i]
      if (last.id !== cur.id) {
        global[last.id] = tmp

        tmp = []
        last = cur
      } else {
        tmp.push(cur)
      }
      i++
    }

    commit('setData', global)
  },
  loadCSVData ({ state, commit }) {
    fetch('public/csv/log-day1.csv')
      .then(res => {
        window.res = res
        console.log(res)
        res.blob()
      })

    // commit('setCheckoutStatus', null)
    // if (product.inventory > 0) {
    //   const cartItem = state.items.find(item => item.id === product.id)
    //   if (!cartItem) {
    //     commit('pushProductToCart', { id: product.id })
    //   } else {
    //     commit('incrementItemQuantity', cartItem)
    //   }
    //   // remove 1 item from stock
    //   commit('products/decrementProductInventory', { id: product.id }, { root: true })
    // }
  }
}
