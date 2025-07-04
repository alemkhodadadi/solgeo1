import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store/auth' // adjust if path is different
import { useProjectStore } from '@/store/project'
import AppLayout from '@/layouts/AppLayout.vue'


export const routes = [
  {
    path: '/projects',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Projects',
        component: () => import('@/views/Projects.vue'),
        meta: {
          title: 'Projects',
          requiresAuth: true,
          requiredRoles: ['admin'],
          hideNavbar: true
        }
      },
    ],
    meta: {
      title: 'Projects',
    }
  },
  {
    path: '/projects/:projectId',
    component: AppLayout,
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'menu.titles.dashboard',
          description: 'menu.descriptions.dashboard',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'data-navigation',
        name: 'Data Navigation',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'menu.titles.dataNavigation',
          description: 'menu.descriptions.dataNavigation',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'analysis',
        name: 'Analysis',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'menu.titles.analysis',
          description: 'menu.descriptions.analysis',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'alarms',
        name: 'Alarms',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'menu.titles.alarms',
          description: 'menu.descriptions.alarms',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      },
      {
        path: 'reports',
        name: 'Reports',
        component: () => import('@/views/Dashboard.vue'),
        meta: {
          title: 'menu.titles.reports',
          description: 'menu.descriptions.reports',
          requiresAuth: true,
          requiredRoles: ['admin']
        }
      }
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
  const projectStore = useProjectStore()

  // 1. Set document title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  const isAuthenticated = authStore.isAuthenticated
  const user = authStore.user

  // 2. If route requires auth and not logged in → redirect to login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 3. If logged in, check roles if required
  if (to.meta.requiresAuth && to.meta.requiredRoles && user) {
    const userRoles = user.roles || []
    const requiredRoles = to.meta.requiredRoles as string[]
    const hasAccess = requiredRoles.some(role => userRoles.includes(role))

    if (!hasAccess) {
      return next('/not-found')
    }
  }

  // 4. If already logged in and tries to go to login → redirect to default
  if (to.path === '/login' && isAuthenticated) {
    return next('/projects')
  }

  // 5. After login, decide where to go based on currentProject
  if (isAuthenticated && to.meta.requiresAuth) {
    const currentProject = projectStore.currentProject

    // if (!currentProject || !currentProject._id) {
    //   // If no project selected and not already on /projects
    //   if (!to.path.startsWith('/projects') || to.params.projectId) {
    //     return next('/projects')
    //   }
    // } else {
    //   const intendedProjectId = currentProject._id.toString()
    //   const isOnProject = to.params.projectId === intendedProjectId

    //   // If user is not on the selected project path, redirect
    //   if (!isOnProject) {
    //     return next(`/projects/${intendedProjectId}/dashboard`)
    //   }
    // }
  }

  return next()
})

export default router
