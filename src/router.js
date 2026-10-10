import { createRouter, createWebHistory } from 'vue-router'
import { getAccessToken } from './helpers/apiHelper'

import AuthLayout from './features/auth/layouts/AuthLayout.vue'
import LoginPage from './features/auth/pages/LoginPage.vue'
const RegisterPage = () => import('./features/auth/pages/RegisterPage.vue')

const AucationLayout = () => import('./features/aucations/layouts/AucationLayout.vue')
const AucationsPage = () => import('./features/aucations/pages/AucationsPage.vue')
const DetailAucationPage = () => import('./features/aucations/pages/DetailAucationPage.vue')
const UsersPage = () => import('./features/users/pages/UsersPage.vue')
const ProfilePage = () => import('./features/users/pages/ProfilePage.vue')
const NotFoundPage = () => import('./features/common/pages/NotFoundPage.vue')

const routes = [
  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginPage
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterPage
      }
    ]
  },
  {
    path: '/',
    component: AucationLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: AucationsPage
      },
      {
        path: 'aucations',
        name: 'AucationsList',
        component: AucationsPage
      },
      {
        path: 'aucations/:id',
        name: 'AucationDetail',
        component: DetailAucationPage
      },
      {
        path: 'users',
        name: 'Users',
        component: UsersPage
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfilePage
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation Guard untuk melindungi rute yang memerlukan autentikasi
router.beforeEach((to, from, next) => {
  const token = getAccessToken()
  if (to.meta.requiresAuth && !token) {
    next('/auth/login')
  } else if ((to.path === '/auth/login' || to.path === '/auth/register') && token) {
    next('/aucations')
  } else {
    next()
  }
})

export { routes }
export default router