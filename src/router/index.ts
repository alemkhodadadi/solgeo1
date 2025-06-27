import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth' // adjust if path is different
import AppLayout from '@/layouts/AppLayout.vue'


export const routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'data-explorer',
        name: 'Data Explorer',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Data Explorer',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Analytics',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'alarms',
        name: 'Alarms',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Alarms',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Tools',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'devices',
        name: 'Devices',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Devices',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Reports',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'repositories',
        name: 'Repositories',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Repositories',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Settings',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/MapView.vue'),
        meta: {
          title: 'Map',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      
    
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: {
      title: 'Login',
    }
  },
  {
    path: '/not-found',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: 'Not Found',
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'CatchAll',
    redirect: '/not-found'
  }
 ]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  console.log('isauthenticated:', authStore.isAuthenticated)
  // Set page title if available
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const isAuthenticated = authStore.isAuthenticated
  const user = authStore.user

  // Redirect to login if route requires auth and user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // If authenticated, check required roles
  if (to.meta.requiresAuth && to.meta.requiredRoles && user) {
    const userRoles = user.roles || [] // Adjust depending on your AuthenticatedUser interface
    const requiredRoles = to.meta.requiredRoles as string[]

    const hasAccess = requiredRoles.some(role => userRoles.includes(role))

    if (!hasAccess) {
      return next('/not-found') // or redirect to a 403 page
    }
  }

  // If already logged in and going to /login, redirect to dashboard
  if (to.path === '/login' && isAuthenticated) {
    return next('/dashboard')
  }

  return next()
})

export default router
