<template>
    <v-app standalone>
        <v-navigation-drawer persistent v-model="drawer" light enable-resize-watcher overflow absolute>
            <v-list>
                <v-list-tile>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            <span>Menu</span>
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-divider></v-divider>
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
        <v-toolbar class="indigo" dark>
            <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
            <v-toolbar-title>Dashboard</v-toolbar-title>
        </v-toolbar>
        <main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </main>
        <v-footer class="indigo">
            <span class="white--text">© 2017 NTCU</span>
        </v-footer>
    </v-app>
</template>

<script>
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
                title: 'Profile',
                icon: 'extension',
            }]
        }
    }
}
</script>
