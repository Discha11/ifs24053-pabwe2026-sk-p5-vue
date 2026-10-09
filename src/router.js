import { createRouter, createWebHistory } from 'vue-router'
import AuthLayout from './features/auth/layouts/AuthLayout.vue'
import LoginPage from './features/auth/pages/LoginPage.vue'
import RegisterPage from './features/auth/pages/RegisterPage.vue'

import AucationLayout from './features/aucations/layouts/AucationLayout.vue'
import AucationsPage from './features/aucations/pages/AucationsPage.vue'
import DetailAucationPage from './features/aucations/pages/DetailAucationPage.vue'
import UsersPage from './features/users/pages/UsersPage.vue'
import ProfilePage from './features/users/pages/ProfilePage.vue'
import NotFoundPage from './features/common/pages/NotFoundPage.vue'
import { getAccessToken } from './helpers/apiHelper'

const routes = [
  {
    path: '/',
    redirect: '/aucations'
  },
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