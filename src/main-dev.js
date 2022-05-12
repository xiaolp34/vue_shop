import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/fonts/iconfont.css'
import '@/assets/css/global.css'
import axios from 'axios'
// 导入第三方依赖包 vue-table-with-tree-grid
import ZkTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式文件
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 导入 NProgress 包对应的js和css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 全局注册富文本编辑器
Vue.use(VueQuillEditor)

// 全局自定义注册
Vue.component('tree-table', ZkTable)
Vue.config.productionTip = false

// 全局过滤器  处理时间格式
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  // padStart(2,'0') 字符串不足2位补'0'
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1'
// axios请求拦截器
// 在 request 请求拦截器中 展示进度条 NProgress.start()
axios.interceptors.request.use((config) => {
  // 为请求头对象添加token验证的 Authorization字段
  config.headers.Authorization = window.sessionStorage.getItem('token')
  NProgress.start()
  return config
})
// 在 response  响应拦截器中 隐藏进度条 NProgress.done()
axios.interceptors.response.use((config) => {
  // 为请求头对象添加token验证的 Authorization字段
  NProgress.done()
  return config
})

Vue.prototype.$http = axios

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
