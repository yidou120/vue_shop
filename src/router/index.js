import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user/Users.vue'
import Order from '../components/order/Order.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/', redirect: '/login'
  },
  {
    path: '/login', component: Login
  },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [{ path: '/welcome', component: Welcome }, { path: '/users', component: Users }, { path: '/orders', component: Order }]
  }
]

const router = new VueRouter({
  routes
})

export default router
// 给路由设置导航守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const token = window.sessionStorage.getItem('token')
  if (!token) return next('/login')
  next()
})
