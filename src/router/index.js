import { createRouter, createWebHistory } from 'vue-router'
import layoutVue from "@/layout.vue";
import IndexView from "@/views/IndexView.vue";
const routes = [
    {
        path: '/',
        component: layoutVue,
        children: [
            {path: '', component: IndexView},
        ]
    }
]
export const router = createRouter({
    history: createWebHistory(),
    routes
})



export default router
