import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import VueHead from 'vue-head'
import Vuetify from 'vuetify'

import Menu from './Component/Menu.vue'

import HomeView from './Component/Home.vue'
import ProfileView from './Component/Profile.vue'
import Clusters from './Component/Clusters.vue'

Vue.use(VueHead)
Vue.use(VueRouter)
Vue.use(VueHead)
Vue.use(Vuetify)

const routes = [
    { path: '/', component: HomeView },
    { path: '/home', component: HomeView },
    { path: '/profile', component: ProfileView },
    { path: '/clusters', component: Clusters },
]

const router = new VueRouter({
    routes: routes
})
const app = new Vue({
    router,
    render: h => h(Menu)
}).$mount('#app')