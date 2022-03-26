import Vue from 'vue'
import VueRouter from 'vue-router'
import HairMaster from '../views/HairMaster.vue'
import Login from '../views/Login.vue'
import VipUser from '../views/VipUser.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'index',
    redirect: {name:"login"}
  },
  {
    path: '/vipUser',
    name: 'vipUser',
    component: VipUser
  },
  {
    path: '/hairMaster',
    name: 'hairMaster',
    component: HairMaster
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
