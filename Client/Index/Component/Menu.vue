<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed clipped app v-model="drawer" dark>
      <v-list dense>
        <template v-for="(item, i) in items">
          <v-list-tile :key="i" :href="item.href" :to="item.to" :router="item.router">
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar color="blue darken-3" dark app clipped-left fixed>
      <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <span class="hidden-xs-only">Crown</span>
      </v-toolbar-title>
    </v-toolbar>
    <v-content>
      <router-view>

      </router-view>
    </v-content>
    <v-footer color="blue darken-3" app fixed>
      <span class="white--text">&copy; 2017 NTCU CS</span>
    </v-footer>
  </v-app>
</template>

<script>
import API from "../../WebAPI";
export default {
  data() {
    return {
      drawer: true,
      items: [
        {
          to: "/home",
          router: true,
          text: "Home",
          icon: "home"
        },
        {
          to: "/clusters",
          router: true,
          text: "Clusters",
          icon: "extension"
        },
        {
          href: "/logout",
          text: "Logout",
          icon: "arrow_back"
        }
      ],
      user: {},
      ismanager: false
    };
  },
  created: function() {
    API.getUser(
      res => {
        this.user = res.body;
        if (this.user.authority.type === "manager") {
          this.ismanager = true;
          this.items.splice(1, 0, {
            to: "/profile",
            router: true,
            text: "Administrator",
            icon: "fas fa-users"
          });
          this.items.splice(3, 0, {
            to: "/simulator",
            router: true,
            text: "Simulation",
            icon: "fas fa-chart-line"
          });
          this.items.splice(4, 0, {
            to: "/editor",
            router: true,
            text: "Editor",
            icon: "fas fa-edit"
          });
        } else {
          this.items.splice(1, 0, {
            to: "/profile",
            router: true,
            text: "User",
            icon: "fas fa-user"
          });
        }
      },
      res => {
        this.user = "";
      }
    );
  }
};
</script>
