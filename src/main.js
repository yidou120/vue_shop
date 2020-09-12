import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 导入iconfonts
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'
import ZkTable from 'vue-table-with-tree-grid'
import axios from 'axios'

Vue.prototype.$http = axios
Vue.component('tree-table', ZkTable)
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.filter('timeformat', function (time) {
  const date = new Date(time)
  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + 1 + '').padStart(2, '0')
  const h = (date.getHours() + 1 + '').padStart(2, '0')
  const mm = (date.getMinutes() + 1 + '').padStart(2, '0')
  const s = (date.getSeconds() + 1 + '').padStart(2, '0')
  return `${y}-${m}-${d} ${h}:${mm}:${s}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
