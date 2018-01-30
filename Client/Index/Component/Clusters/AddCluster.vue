<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition" persistent>
      <v-btn fab dark class="indigo" slot="activator">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-card>
        <v-toolbar dark class="primary">
          <v-toolbar-title>Add Cluster</v-toolbar-title>
        </v-toolbar>
        <v-stepper v-model="step" vertical>
          <v-stepper-step step="1" v-bind:complete="step > 1">
            Step One
            <small>Set Cluster's name.</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-text-field label="Cluster Name" required v-model="newcluster.name"></v-text-field>
            <v-btn class="primary" @click.native="step = 2">Continue</v-btn>
            <v-btn flat @click.native="cleanitem">Cancel</v-btn>
          </v-stepper-content>
          <v-stepper-step step="2" v-bind:complete="step > 2">
            Step Two
            <small>Set nodes list.</small>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-text-field type="Number" label="Cluster Nodes Count" required v-model="newcluster.nodes" @change="nodecout"></v-text-field>
            <v-data-table v-bind:headers="headers" :items="newcluster.nodeslist" hide-actions class="elevation-1">
              <template slot="items" slot-scope="props">
                <td>
                  <v-text-field required v-model="props.item.nodename"></v-text-field>
                </td>
                <td>
                  <v-text-field required v-model="props.item.nodeip"></v-text-field>
                </td>
                <td>
                  <v-text-field required v-model="props.item.nodeport"></v-text-field>
                </td>
                <td>
                  <v-text-field required v-model="props.item.nodessh"></v-text-field>
                </td>
                <td>
                  <v-text-field type="number" required v-model="props.item.nodenp"></v-text-field>
                </td>
              </template>
            </v-data-table>
            <v-btn class="primary" @click.native="step = 3">Continue</v-btn>
            <v-btn flat @click.native="cleanitem">Cancel</v-btn>
          </v-stepper-content>
          <v-stepper-step step="3" v-bind:complete="step > 3">
            Step Three
            <small>Set schedulor.</small>
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-select label="Schedule alogrithm select." :items="options" v-model="newcluster.scheduler"></v-select>
            <v-btn class="primary" @click.native="additem">Continue</v-btn>
            <v-btn flat @click.native="cleanitem">Cancel</v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import API from "../../../WebAPI.js";
export default {
  data() {
    return {
      step: 1,
      dialog: false,
      headers: [
        { text: "Name", value: "name", align: "left" },
        { text: "IP", value: "nodes", align: "left" },
        { text: "Mom's Port", value: "port", align: "left" },
        { text: "SSH Port", value: "ssh", align: "left" },
        { text: "CPU", value: "cpu", align: "left" }
      ],
      newcluster: {
        name: "",
        port: "",
        nodes: 1,
        nodeslist: [
          {
            nodename: "",
            nodeip: "",
            nodeport: "",
            nodenp: 0,
            nodessh: ""
          }
        ],
        status: "",
        scheduler: ""
      }
    };
  },
  computed: {
    options: function() {
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
  methods: {
    additem(event) {
      let msg = {
        name: this.newcluster.name,
        nodes: this.newcluster.nodes,
        nodeslist: this.newcluster.nodeslist,
        scheduler: this.newcluster.scheduler
      };
      API.addcluster(
        msg,
        result => {
          this.user.clusters = result.body.clusters;
        },
        result => {
          alert(result.body);
        }
      );
      this.cleanitem();
    },
    cleanitem() {
      this.newcluster.name = "";
      this.newcluster.port = "";
      this.newcluster.nodes = 1;
      this.newcluster.nodeslist = [
        {
          nodename: "",
          nodeip: "",
          nodeport: "",
          nodenp: 0,
          nodessh: ""
        }
      ];
      this.newcluster.status = "";
      this.newcluster.scheduler = "";
      this.step = 1;
      this.dialog = false;
    },
    nodecout(event) {
      if (this.newcluster.nodes > this.newcluster.nodeslist.length) {
        var i = 0;
        for (
          i = this.newcluster.nodeslist.length;
          i < this.newcluster.nodes;
          i++
        ) {
          this.newcluster.nodeslist.push({
            nodename: "",
            nodeip: "",
            nodeport: "",
            nodenp: 0,
            nodessh: ""
          });
        }
      } else {
        var i = 0;
        for (
          i = this.newcluster.nodeslist.length;
          i > this.newcluster.nodes;
          i--
        ) {
          this.newcluster.nodeslist.pop();
        }
      }
    }
  },
  props: ["user", "modes"]
};
</script>