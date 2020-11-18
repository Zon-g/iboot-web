import Vue from 'vue'
import VueRouter, {RouteConfig} from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
    {
        path: '/',
        redirect: 'login'
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/main',
        redirect: '/index',
        name: 'Main',
        component: () => import('../views/Main.vue'),
        children: [
            {
                path: '/index',
                name: 'Index',
                component: () => import('../views/Index.vue')
            },
            {
                path: '/user',
                name: 'User',
                component: () => import('../views/System/User.vue')
            },
            {
                path: '/department',
                name: 'Department',
                component: () => import('../views/System/Department.vue')
            },
            {
                path: '/authority',
                name: 'Authority',
                component: () => import('../views/System/Authority.vue')
            },
            {
                path: '/role',
                name: 'Role',
                component: () => import('../views/System/Role.vue')
            },
            {
                path: '/SQL',
                name: 'SQLMonitor',
                component: () => import('../views/Maintenance/Druid.vue')
            },
            {
                path: '/redis',
                name: 'Redis',
                component: () => import('../views/Maintenance/Redis.vue'),
                redirect: '/RedisIndex',
                children: [
                    {
                        path: '/redisIndex',
                        name: 'Index',
                        component: () => import('../views/Maintenance/Index.vue')
                    },
                    {
                        path: '/parameter',
                        name: 'Parameter',
                        component: () => import('../views/Maintenance/Parameters.vue')
                    },
                    {
                        path: '/cache',
                        name: 'Cache',
                        component: () => import('../views/Maintenance/Cache.vue')
                    }
                ]
            },
            {
                path: '/swagger',
                name: 'APIDocument',
                component: () => import('../views/Maintenance/Swagger.vue')
            },
            {
                path: '/knife4j',
                name: 'KnifeDocument',
                component: () => import('../views/Maintenance/Knife4j.vue')
            },
            {
                path: '/backup',
                name: 'BackUp',
                component: () => import('../views/Maintenance/BackUp.vue')
            },
            {
                path: '/chart',
                name: 'Chart',
                component: () => import('../views/Component/Chart.vue')
            },
            {
                path: '/icon',
                name: 'Icon',
                component: () => import('../views/Component/Icon.vue')
            },
            {
                path: '/menu',
                name: 'Menu',
                component: () => import('../views/MultiMenu.vue')
            },
            {
                path: '/logger',
                name: 'Logger',
                component: () => import('../views/Maintenance/Logger.vue')
            },
            {
                path: '/attachment',
                name: 'Attachment',
                component: () => import('../views/Maintenance/Attachment.vue')
            }
        ]
    }
]

const router = new VueRouter({
    routes
})

export default router
