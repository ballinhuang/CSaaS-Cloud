<!--
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
-->
<template>
    <v-app id="example-2" standalone>
        <v-navigation-drawer permanent light>
            <v-toolbar flat class="transparent">
                <v-list class="pa-0">
                    <v-list-tile avatar tag="ul">Test</v-list-tile>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list dense class="pt-0">
                <v-list-tile v-for="item in items" :key="item.title" :href="item.href" :router="item.router">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar class="cyan" dark>
            <v-toolbar-title>Toolbar</v-toolbar-title>
        </v-toolbar>
        <main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </main>
    </v-app>
</template>

<script>
export default {
    data () {
        return {
            items: [{
                href: '#/home',
                router: true,
                title: 'Home',
                icon: 'home',
            }, {
                href: '#/profile',
                router: true,
                title: 'Profile',
                icon: 'extension',
            }]
        }
    },
    methods: {
    }
}
</script>

