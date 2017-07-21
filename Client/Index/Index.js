import Vue from 'vue'
import VueRouter from 'vue-router'
import VueHead from 'vue-head'
import HomeView from './Component/Home.vue'
import ProfileView from './Component/Profile.vue'
Vue.use(VueRouter)
Vue.use(VueHead)
const routes = [
    { path: '/home', component: HomeView },
    { path: '/profile', component: ProfileView }
]

const router = new VueRouter({
    routes: routes
})
const app = new Vue({
    router
}).$mount('#app')