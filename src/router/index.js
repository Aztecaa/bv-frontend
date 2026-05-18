import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../store/user'

const routes = [
    { path: '/', component: () => import('../views/Home.vue') },
    { path: '/login', component: () => import('../views/Login.vue') },
    { path: '/panel', component: () => import('../views/Panel.vue'), meta: { requiresAuth: true, roles: ['supervisor'] } },
    { path: '/dashboard', component: () => import('../views/Dashboard.vue'), meta: { requiresAuth: true, roles: [ 'supervisor'] } },
    { path: '/store', component: () => import('../views/Store.vue'), meta: { requiresAuth: true, roles: ['cliente', 'supervisor'] } },
    { path: '/users', component: () => import('../views/Users.vue'), meta: { requiresAuth: true, roles: ['supervisor'] } }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const userStore = useUserStore()

    if (to.meta.requiresAuth && !userStore.user) return next('/login')
    if (to.path === '/login' && userStore.user) return next('/store')

    if (to.meta.roles && !to.meta.roles.includes(userStore.role)) return next('/store')

    next()
})

export default router
