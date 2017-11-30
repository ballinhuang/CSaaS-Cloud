<template>
    <v-dialog v-model="dialog" width="800px">
        <v-btn primary dark slot="activator">Node List</v-btn>
        <v-card>
            <v-card-title>
                <span class="headline">Node List</span>
            </v-card-title>
            <addnode v-show="ismanager" @closenodelist="dialog = false" :clustername="clustername" :user="user"></addnode>
            <v-card-text>
                <v-data-table v-bind:headers="headers" :items="node" hide-actions class="elevation-1">
                    <template slot="items" scope="props">
                        <td>{{ props.item.nodename }}</td>
                        <td>{{ props.item.nodeip }}</td>
                        <td>{{ props.item.nodeport }}</td>
                        <td>{{ props.item.nodenp }}</td>
                        <td>
                            <v-btn v-show="ismanager" icon class="indigo--text" v-on:click="removenode(props.item.nodename)">
                                <v-icon>fa-trash-o</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
                
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="blue--text darken-1" flat @click.native="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import AddNode from "./AddNode.vue";
import API from "../../../WebAPI.js";
export default {
  data() {
    return {
      headers: [
        { text: "Node name", align: "left" },
        { text: "IP", align: "left" },
        { text: "Port", align: "left" },
        { text: "CPU", align: "left" },
        { text: "Operate", align: "left" }
      ],
      showaddnode: false,
      dialog: false
    };
  },
  methods: {
    removenode(nodename) {
      API.operatecluster(
        this.clustername,
        { op: "removenode", data: { nodename: nodename } },
        res => {
          this.user.clusters = res.body.clusters;
        },
        res => {
          alert("ERROR");
        }
      );
    }
  },
  components: {
    addnode: AddNode
  },
  props: ["node", "user", "clustername", "ismanager"]
};
</script>