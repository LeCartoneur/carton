import Vue from 'vue'
import VueRouter from 'vue-router'
import Accueil from '../views/Accueil.vue'
import Carton from '../views/Carton.vue'
import Visionneuse from '../views/Visionneuse.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Accueil',
    component: Accueil,
  },
  {
    path: '/carton/',
    component: Carton,
    props: true,
  },
  {
    path: '/carton/:carton_id',
    component: Visionneuse,
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
