
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"
import { App } from 'vue'
import Cookies from "js-cookie"
import store from '../store'
// import { getAdminInfoApi } from '../request/api'

const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/login.vue')
    },
    // {
    //     path: '/homepage',
    //     name: 'homepage',
    //     component: () => import('@/views/homePage/homePage.vue')
    //     // component: resolve => require(["../views/homePage/homePage.vue"], resolve) 
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes // 路由配置
})

export const initRouter = (app: App<Element>) => {
    app.use(router)
}
// export default只能默认导出一个  上边的可以导出多个
// export default router

const getRoutes = () => {
    const menus = store.getters.getNewMenus
    for (let key in menus) {
        const newRoutes: RouteRecordRaw = {
            path: '/' + menus[key].name,
            name: menus[key].name,
            component: () => import('@/views/homePage/homePage.vue'),
            redirect: "/" + menus[key].name + '/' + menus[key].children[0].name,
            children: []
        }
        for (let i = 0; i < menus[key].children.length; i++) {
            newRoutes.children?.push({
                path: menus[key].children[i].name,
                name: menus[key].children[i].name,
                component: () => import(`@/views/${menus[key].name}/${menus[key].children[i].name}.vue`),
                children: []
            })
        };
        router.addRoute(newRoutes)
    }
    router.addRoute(
        {
            path: '/',
            name: 'homePage',
            component: () => import("@/views/homePage/homePage.vue"),
            redirect: "/index",
            children: [
                {
                    path: 'index',
                    name: 'index',
                    component: () => import("@/views/index/index.vue"),
                }
            ]
        }
    )
}

router.beforeEach((to, from, next) => {
    const token = Cookies.get('token')
    if (token && store.state.menus.length === 0) {
        store.dispatch('getAdminInfo').then(res => {
            // const newRoutes: RouteRecordRaw[] = [];
            getRoutes()
            next(to.path)
        })
    } else if (token && store.state.menus.length !== 0 && to.path === '/homepage' && from.path === '/login') {
        getRoutes()
        next('/index')
    } else if (token && to.path === '/login') {
        next(from)
    } else if (!token && to.path !== '/login') {
        next('/login')
    } else {
        next()
    }
})

