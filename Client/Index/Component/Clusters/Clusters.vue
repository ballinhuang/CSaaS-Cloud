<template>
  <v-container>
    <div class="display-2">Cluster List</div>
    <v-spacer></v-spacer>
    <v-layout row wrap>
      <v-flex xs1 class="text-xs-right">
        <addcluster v-if="ismanager" :modes="modes" :user="user"></addcluster>
      </v-flex>
      <v-flex xs5 class="pb-3" offset-xs6>
        <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
      </v-flex>
    </v-layout>
    <v-alert :class="alertmsg.type" transition="scale-transition" v-model="alertmsg.alert">
      <v-layout row wrap>
        <v-flex xs11>
          {{alertmsg.msg}}
        </v-flex>
        <v-flex xs1>
          <v-btn dark flat v-on:click.native="cleanalert">close</v-btn>
        </v-flex>
      </v-layout>
    </v-alert>
    <v-card>
      <v-data-table v-bind:headers="headers" v-bind:items="user.clusters" v-bind:search="search">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.nodes }}</td>
          <td>{{ props.item.port }}</td>
          <td>{{ props.item.scheduler }}</td>
          <td>{{ props.item.status }}</td>
          <td>
            <v-layout row wrap>
              <nodelist :clustername="props.item.name" :ismanager="ismanager" :node="props.item.nodeslist" :user="user"></nodelist>
              <jobstat :status="props.item.status" :clustername="props.item.name"></jobstat>
            </v-layout>
          </td>
          <td>
            <v-layout row wrap>
              <subjob v-show="!ismanager" :cluster="props.item" :alertmsg="alertmsg">
              </subjob>
              <usersetting v-show="!ismanager" :user="user" :cluster="props.item" :alertmsg="alertmsg">
              </usersetting>
              <v-btn class="primary" dark v-show="!ismanager" :to="'/clustereditor/' + props.item.name">Editor</v-btn>
              <v-btn v-show="ismanager && props.item.status !== 'Work'" icon class="indigo--text" v-on:click="recovercluster(props.item.name)">
                <v-icon>fas fa-play</v-icon>
              </v-btn>
              <v-btn v-show="ismanager && props.item.status !== 'Stop'" icon class="indigo--text" v-on:click="stopcluster(props.item.name)">
                <v-icon>fas fa-stop</v-icon>
              </v-btn>
              <changemod v-if="ismanager" :user="user" :cluster="props.item" :modes="modes"></changemod>
              <v-btn v-show="ismanager" icon class="indigo--text" v-on:click="removecluster(props.item.name)">
                <v-icon>far fa-trash-alt</v-icon>
              </v-btn>
            </v-layout>
          </td>
        </template>
        <template slot="pageText" slot-scope="{ pageStart, pageStop }">
          From {{ pageStart }} to {{ pageStop }}
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>


<script>
import API from "../../../WebAPI.js";

import AddCluster from "./AddCluster.vue";
import NodesList from "./NodesList.vue";
import Subjob from "./Subjob.vue";
import UserSetting from "./UserSetting.vue";
import Changemode from "./Changemode.vue";
import JobStat from "./JobStat.vue";

export default {
  data() {
    return {
      search: "",
      pagination: {},
      headers: [
        { text: "Cluster Name", value: "name", align: "left" },
        { text: "Node Count", value: "nodes", align: "left" },
        { text: "Port", value: "port", align: "left" },
        { text: "Scheduling mode", value: "scheduler", align: "left" },
        { text: "Status", value: "status", align: "left" },
        { text: "Information", value: "information", align: "left" },
        { text: "Operate", value: "operate", align: "left" }
      ],
      user: {},
      alertmsg: { alert: false, type: "", msg: "" },
      ismanager: false,
      modes: []
    };
  },
  methods: {
    cleanalert() {
      this.alertmsg.msg = "";
      this.alertmsg.alert = false;
    },
    stopcluster(clustername) {
      API.operatecluster(
        clustername,
        { op: "Stop" },
        res => {
          this.user = res.body;
        },
        res => {
          alert("ERROR");
        }
      );
    },
    removecluster(clustername) {
      API.operatecluster(
        clustername,
        { op: "Remove" },
        res => {
          this.user = res.body;
        },
        res => {
          alert("ERROR");
        }
      );
    },
    recovercluster(clustername) {
      API.operatecluster(
        clustername,
        { op: "Recover" },
        res => {
          this.user = res.body;
        },
        res => {
          alert("ERROR");
        }
      );
    }
  },
  components: {
    addcluster: AddCluster,
    nodelist: NodesList,
    subjob: Subjob,
    usersetting: UserSetting,
    changemod: Changemode,
    jobstat: JobStat
  },
  beforeCreate: function() {
    API.getUser(
      res => {
        this.user = res.body;
        if (this.user.authority.type === "manager") {
          this.ismanager = true;
          API.getfile(
            "Scheduler",
            res => {
              this.modes = res.body;
            },
            res => {
              alert("ERROR");
            }
          );
        }
      },
      res => {
        alert("ERROR");
      }
    );
  }
};
</script>

