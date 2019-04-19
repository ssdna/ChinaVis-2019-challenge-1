import Vue from 'vue'
import 'reset-css'
import App from './components/App.vue'
import store from './store'
// import './js/1'
// import './js/2'

window.start = performance.now()

const v = new Vue({
  store,
  render: h => h(App)
})

v.$mount('#app')
window.v = v

// store.dispatch('loadJSONData')
store.dispatch('loadCSVData', 'log-day1.csv')
