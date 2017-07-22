import Vue from 'vue'
import VueHead from 'vue-head'
import LoginView from './Component/Login.vue'

Vue.use(VueHead)


new Vue({
    el: '#app',
    components: {
        'loginform': LoginView
    }
})