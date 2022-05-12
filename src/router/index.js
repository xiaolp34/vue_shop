// 路由懒加载
// 如果我们把不同的路由对应的组件分隔成不同的代码快，然后当路由被访问的时候才加载对应的组件，这样更加高效
// 1.安装 @babel/plugin-syntax-dynamic-import 包
// 2.在babel.config.js配置文件中声明该插件
// plugins: [
//   '@babel/plugin-syntax-dynamic-import'
// ]
// 3.将路由改为按需加载的形式
// const 注册名 = () => import(/* webpackChunkName: "组名" */ '路由模块文件位置')
// import Home from '@/components/HomeL.vue'
// const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/HomeL.vue')
// 组名相同的路由会合并到同一个模块
// 组内只要有一个路由模块被加载 同一个组里其他的路由模块都会被加载

import Vue from 'vue'
import VueRouter from 'vue-router'

// import Login from '@/components/Login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Login.vue')
// import Home from '@/components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Home.vue')
// import Welcome from '@/components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '@/components/Welcome.vue')

// import Users from '@/components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users_eights_roles" */ '@/components/user/Users.vue')
// import Rights from '@/components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "users_eights_roles" */ '@/components/power/Rights.vue')
// import Roles from '@/components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName: "users_eights_roles" */ '@/components/power/Roles.vue')

// import Cate from '@/components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Cate.vue')
// import Params from '@/components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ '@/components/goods/Params.vue')

// import List from '@/components/goods/List.vue'
const List = () => import(/* webpackChunkName: "list_add" */ '@/components/goods/List.vue')
// import AddGoods from '@/components/goods/Add.vue'
const AddGoods = () => import(/* webpackChunkName: "list_add" */ '@/components/goods/Add.vue')

// import Order from '@/components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "order_report" */ '@/components/order/Order.vue')
// import Report from '@/components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "order_report" */ '@/components/report/Report.vue')

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      children: [
        { path: '', redirect: 'welcome' },
        { path: 'welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: AddGoods },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
