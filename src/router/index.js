// 路由

import Vue from 'vue'
import VueRouter from 'vue-router'

// 利用路由对文件进行 懒加载
const Login = () => import('@/views/login/Login')
const Home = () => import('@/views/home/Home')
const Welcome = () => import('@/views/welcome/Welcome')
const Users = () => import('@/views/users/Users')
const Rights = () => import('@/views/rights/Rights')
const Roles = () => import('@/views/roles/Roles')
const Goods = () => import('@/views/goods/Goods') 
const Params = () => import('@/views/params/Params') 
const Categories = () => import('@/views/categories/Categories') 
const Orders = () => import('@/views/orders/Orders') 
const Reports = () => import('@/views/reports/Reports') 

const Add = () => import('@/views/goods/add/Add') 


// 1 安装插件
Vue.use(VueRouter)

// 结合在一起
// export default new Router({
//   routes: [
//     {
//       path: '',
//       redirect: '/login'
//     },
//     {
//       path: '/login',
//       component: Login
//     },
//     {
//       path: '/home',
//       component: Home
//     }
//   ],
//   mode: 'history'
// })


// 2 抽离出去的属性
const routes = [
  // 重定向 最初开始展示的页面
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home', 
    component: Home,
    // 跳转到首页时 先跳转到首页的子路由 欢迎页面   2 在Home.vue中使用占位符使用
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        component: Welcome,
      },
      {
        path: '/users',
        component: Users,
      },
      {
        path: '/rights',
        component: Rights,
      },
      {
        path: '/roles',
        component: Roles
      },
      {
        path: '/goods',
        component: Goods,
      },
      {
        path: '/goods/add',
        component: Add,
      },
      {
        path: '/params',
        component: Params
      },
      {
        path: '/categories',
        component: Categories
      },
      {
        path: '/orders',
        component: Orders
      },
      {
        path: '/reports',
        component: Reports
      },
    ]
  }
]
// 2 创建对象
const router = new VueRouter({
  // 属性
  routes,
  // 哈希模式
  mode: 'history'
  
})

// 路由守卫判断用户是否登录
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // 如果是到登录页面直接 放行函数(放行到需要跳转到的函数)
  if(to.path === '/login') return next() 
  // 查看浏览器是否保存了 token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  // 没有 return出去 说明这个字符串存在 直接放行
  next()
})


// 3 导出
export default router

// 4 在mian.js 中挂载