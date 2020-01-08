import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'

Vue.config.productionTip = false
Vue.component('cu-custom',cuCustom)

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
