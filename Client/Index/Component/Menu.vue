<template>
    <div>
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
                    </ul>
                </div>
            </div>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script>
import API from '../../WebAPI.js'
export default {
    data () {
        return {
            UserName: ""
        }
    },
    methods: {
    },
    created: function () {
        API.getUserName((res) => {
            this.UserName = res.body.name;
        }, (res) => {
            this.UserName = "";
        })
    }
}
</script>
