import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueHead from 'vue-head'
import HomeView from './Component/Home.vue'
import ProfileView from './Component/Profile.vue'
import Menu from './Component/Menu.vue'

Vue.use(VueRouter)
Vue.use(VueHead)
Vue.use(VueResource)
const routes = [
    { path: '/', component: HomeView },
    { path: '/home', component: HomeView },
    { path: '/profile', component: ProfileView }
]

const router = new VueRouter({
    routes: routes
})
const app = new Vue({
    router,
    render: h => h(Menu)
}).$mount('#app')