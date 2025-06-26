import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
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
        }
      },
      {
        path: 'data-explorer',
        name: 'Data Explorer',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Data Explorer',
        }
      },
      {
        path: 'analytics',
        name: 'Analytics',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Analytics',
        }
      },
      {
        path: 'alarms',
        name: 'Alarms',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Alarms',
        }
      },
      {
        path: 'tools',
        name: 'Tools',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Tools',
        }
      },
      {
        path: 'devices',
        name: 'Devices',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Devices',
        }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Reports',
        }
      },
      {
        path: 'repositories',
        name: 'Repositories',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Repositories',
        }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'Settings',
        }
      },
      {
        path: 'map',
        name: 'Map',
        component: () => import('@/views/MapView.vue'),
        meta: {
          title: 'Map',
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
 ]


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes
})

export default router
