<template>
  <v-layout>
    <v-btn class="primary" dark @click.native.stop="open">Cluster Setting</v-btn>
    <v-dialog v-model="dialog" scrollable max-width="300px">
      <v-card>
        <v-card-title>Select Clusters</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 300px;">
          <v-layout row wrap>
            <v-flex xs4 md6>
              <v-card-text>
                <v-checkbox v-for="cluster in user.clusters" :key="cluster.name" :label="cluster.name" v-model="newclustersset" :value="cluster.name"></v-checkbox>
              </v-card-text>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat @click.native="clean">Close</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import API from "../../../WebAPI.js";

export default {
  data() {
    return {
      dialog: false,
      newclustersset: []
    };
  },
  methods: {
    open() {
      this.dialog = true;
      this.newclustersset = [];
      for (const usercluster in this.clusters) {
        this.newclustersset.push(this.clusters[usercluster].name);
      }
    },
    clean() {
      this.dialog = false;
      this.newclustersset = [];
    },
    save() {
      const msg = {
        username: this.username,
        clusterlist: this.newclustersset
      };
      API.setcluster(
        msg,
        result => {
          this.user.users = result.body.users;
        },
        result => {
          this.alertmsg.alert = true;
          this.alertmsg.type = "error";
          this.alertmsg.msg = result.body;
        }
      );
      this.clean();
    }
  },
  props: ["username", "clusters", "user", "alertmsg"]
};
</script>