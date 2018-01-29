<template>
  <div>
    <v-btn fab dark class="indigo" @click.native.stop="open">
      <v-icon dark>add</v-icon>
    </v-btn>
    <v-dialog v-model="addnodedialog" width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Add Node</span>
        </v-card-title>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs3>
              <v-text-field label="Node name" v-model="nodename">
              </v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field label="Node Ip" v-model="nodeip">
              </v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field label="Node Port" v-model="nodeport">
              </v-text-field>
            </v-flex>
            <v-flex xs3>
              <v-text-field label="Node NP" v-model="nodenp">
              </v-text-field>
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
      nodename: "",
      nodeip: "",
      nodeport: "",
      nodenp: "",
      addnodedialog: false
    };
  },
  methods: {
    clear() {
      this.nodename = "";
      this.nodeip = "";
      this.nodeport = "";
      this.nodenp = "";
      this.addnodedialog = false;
    },
    submit() {
      API.operatecluster(
        this.clustername,
        {
          op: "addnode",
          data: {
            nodename: this.nodename,
            nodeip: this.nodeip,
            nodeport: this.nodeport,
            nodenp: this.nodenp
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
      this.addnodedialog = true;
      this.$emit("closenodelist");
    }
  },
  props: ["clustername", "user"]
};
</script>
