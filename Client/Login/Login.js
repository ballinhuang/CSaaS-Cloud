import Vue from 'vue'
import VueHead from 'vue-head'
import LoginView from './Component/Login.vue'
import VueResource from 'vue-resource'

Vue.use(VueHead)
Vue.use(VueResource)

new Vue({
    el: '#app',
    components: {
        'loginform': LoginView
    }
})