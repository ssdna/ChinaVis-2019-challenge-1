import Vue from 'vue'

// import Application from './js/Application'
import App3D from './js/App3D'

import App from './components/App.vue'
import store from './store'
// import './js/1'
// import './js/2'

const app3D = new App3D(true)
app3D.animate()

const v = new Vue({
  store,
  render: h => h(App)
})

v.$mount('#app')
window.v = v

store.dispatch('loadJSONData')
