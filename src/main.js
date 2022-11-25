import Vue from 'vue'
import App from './App.vue'
import router from './router'
 
// 导入第三方插件   树形控件
import TreeTable from 'vue-table-with-tree-grid'
// 全局注册第三方插件
Vue.component('tree-table', TreeTable)

// 导入 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入对应的样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
// 全局注册第三方插件
Vue.use(VueQuillEditor)


// element-ui 按需导入
// import {Form, FormItem } from 'element-ui'
// Vue.use(Form)
// Vue.use(FormItem)

// 导入element-ui
import ElementUi from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUi)

// 导入 axios
import axios from 'axios'
// 1 配置请求的根路径       使用: this.$http  获取原型上配置的$http
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// axios请求拦截    属性 request 就是请求拦截器  config请求对象
axios.interceptors.request.use(config => {
  console.log(config)
  // 给接口的请求头(headers) 添加一个请求字段 Authorization     
  // 给headers添加一个属性(Authorization) 这个属性从浏览器内存获取(token)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  // 固定写法  最后必须 return
  return config
})
// 2 挂载到vue原型上
Vue.prototype.$http = axios

// 定义全局 时间过滤器      padStart(2, '0')不足俩位,在前面补0         main.js
// 使用: 原数据 | dataFormat  {{scope.row.add_time | dataFormat}} 
Vue.filter('dataFormat', function(originValue) {
  const date = new Date(originValue * 1000)

  const y = date.getFullYear()
  const m = (date.getMonth() + 1 + '').padStart(2, '0')
  const d = (date.getDate() + '').padStart(2, '0')

  const hh = (date.getHours() + '').padStart(2, '0')
  const mm = (date.getMinutes() + '').padStart(2, '0')
  const ss = (date.getSeconds() + '').padStart(2, '0')

  // 模板字符串
  // return `yyyy-mm-dd hh:mm:ss`
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
