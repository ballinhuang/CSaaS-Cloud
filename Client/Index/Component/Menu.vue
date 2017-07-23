<template>
    <nav>
        <div class="nav-wrapper cyan">
            <div class="container">
                <a class="brand-logo">Menu</a>
                <ul id="nav-mobile" class="right hide-on-med-and-down">
                    <li>
                        <router-link to="/home">Home</router-link>
                    </li>
                    <li>
                        <router-link to="/profile">{{UserName}}</router-link>
                    </li>
                    <li>
                        <button v-on:click="greet">Greet</button>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</template>

<script>
import API from '../../WebAPI.js'
export default {
    data () {
        return {
            UserName: "123"
        }
    },
    methods: {
        greet: function (event) {
            alert(API.getUserName())
        }
    }
}
</script>
