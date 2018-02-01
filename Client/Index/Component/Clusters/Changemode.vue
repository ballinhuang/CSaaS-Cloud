<template>
  <div>
    <v-btn icon class="indigo--text" @click.native.stop="open">
      <v-icon>fas fa-cog</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Change Mode</span>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs6>
              <v-select v-bind:items="items" v-model="mode" label="Select" single-line bottom></v-select>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" @click="submit">Submit</v-btn>
          <v-btn class="blue--text darken-1" @click="clear">Cancle</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import API from "../../../WebAPI.js";
export default {
  data() {
    return {
      dialog: false,
      mode: ""
    };
  },
  methods: {
    clear() {
      this.dialog = false;
    },
    submit() {
      API.operatecluster(
        this.cluster.name,
        {
          op: "changemode",
          data: {
            mode: this.mode
          }
        },
        res => {
          this.user.clusters = res.body.clusters;
        },
        res => {
          alert("ERROR");
        }
      );
      this.clear();
    },
    open() {
      this.dialog = true;
      this.mode = this.cluster.scheduler;
    }
  },
  computed: {
    items: function() {
      var options = [];
      options.push({
        value: "FIFO",
        text: "FIFO"
      });
      this.modes.forEach(element => {
        options.push({
          value: element,
          text: element
        });
      });
      return options;
    }
  },
  props: ["cluster", "user", "modes"]
};
</script>
