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
		beforeEnter: (to, from, next) => {
			const authStore = useAuthStore()
			if (authStore.isAuthenticated) {
				next('/projects')
			} else {
				next('/login')
			}
		},
		name: 'CatchAll',

	}
]


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const projectStore = useProjectStore()

  const isAuthenticated = authStore.isAuthenticated
  console.log('is authenticated in router is:', isAuthenticated)
  const user = authStore.user

  // 1. Set document title
  if (to.meta.title) {
    document.title = to.meta.title as string
  }

  // 2. Redirect to login if required
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // 3. If user is logged in and tries to access login → redirect to /projects
  if (to.path === '/login' && isAuthenticated) {
    return next('/projects')
  }

  // 4. Block access to project subpages if no current project
  if (to.path.startsWith('/projects/') && !projectStore.currentProject) {
    return next('/projects')
  }

  // 5. Prevent switching to another project without exiting current one
  if (to.path.startsWith('/projects/') && projectStore.currentProject) {
	const targetProjectId = to.path.split('/')[2]
	if (targetProjectId && targetProjectId !== projectStore.currentProject._id) {
		console.log('targetProjectId: ',targetProjectId, ' currentProject id: ',projectStore.currentProject._id )
		return next(`/projects/${projectStore.currentProject._id}/dashboard`)
	}
  }

  // 6. If user tries to access `/projects` while a project is open → redirect to dashboard
  if (to.path === '/projects' && projectStore.currentProject) {
    return next(`/projects/${projectStore.currentProject._id}/dashboard`)
  }

  // 7. Role check
  if (to.meta.requiresAuth && to.meta.requiredRoles && user) {
    const userRoles = user.roles || []
    const requiredRoles = to.meta.requiredRoles as string[]
    const hasAccess = requiredRoles.some(role => userRoles.includes(role))

    if (!hasAccess) {
		console.log('not has access')
      	return next('/not-found')
    }
  }

  return next()
})


export default router
