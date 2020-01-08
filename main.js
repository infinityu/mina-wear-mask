import Vue from 'vue'
import App from './App'
import cuCustom from './colorui/components/cu-custom.vue'

Vue.config.productionTip = false
Vue.component('cu-custom',cuCustom)

//引入vuex
import store from './store'
//把vuex定义成全局组件
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    ...App,
	//挂载
	store
})
app.$mount()
