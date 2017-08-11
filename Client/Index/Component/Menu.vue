<template>
    <v-app standalone>
        <v-navigation-drawer dark v-model="drawer" enable-resize-watcher persistent>
            <v-toolbar flat class="transparent">
                <v-list class="pa-0">
                    <v-list-tile avatar tag="div">
                        <v-list-tile-content>
                            <v-list-tile-title>Hello! {{UserName}}</v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </v-list>
            </v-toolbar>
            <v-divider></v-divider>
            <v-list class="pt-0" dense>
                <v-list-tile v-for="item in items" :key="item.title" :href="item.href" :router="item.router">
                    <v-list-tile-action>
                        <v-icon dark>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar class="blue darken-2" fixed dark>
            <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Dashboard</v-toolbar-title>
        </v-toolbar>
        <main>
            <v-container>
                <router-view></router-view>
            </v-container>
        </main>
        <v-footer class="blue darken-2" fixed dark>
            <span class="white--text">© 2017 NTCU</span>
        </v-footer>
    </v-app>
</template>

<script>
import API from '../../WebAPI'
export default {
    data () {
        return {
            drawer: true,
            items: [{
                href: '#/home',
                router: true,
                title: 'Home',
                icon: 'home',
            }, {
                href: '#/profile',
                router: true,
                title: 'Administrator',
                icon: 'extension',
            }, {
                href: '#/board',
                router: true,
                title: 'Clusters',
                icon: 'extension',
            }, {
                title: 'Simulation',
                icon: 'dashboard'
            }],
            UserName: ""
        }
    },
    created: function () {
        API.getUserName((res) => {
            this.UserName = res.body.name;
        }, (res) => {
            this.UserName = ""
        })
    }
}
</script>
