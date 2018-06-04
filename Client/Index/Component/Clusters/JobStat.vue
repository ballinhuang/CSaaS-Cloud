<template>
  <div>
    <v-btn class="primary" dark @click.native.stop="open" :disabled="status==='Stop'">Job Status</v-btn>
    <v-dialog v-model="dialog" width="800px">

      <v-card>
        <v-card-title class="headline">Jobs Status</v-card-title>
        <v-spacer></v-spacer>
        <v-layout row wrap>
          <v-flex xs1 class="text-xs-right">
            <v-btn icon class="green--text" v-on:click="updatedstat()">
              <v-icon>cached</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs5 class="pb-3" offset-xs6>
            <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search">
            </v-text-field>
          </v-flex>
        </v-layout>

        <v-card-text>
          <v-data-table v-bind:headers="headers" v-bind:items="items" v-bind:search="search">
            <template slot="items" slot-scope="props">
              <td>{{props.item.JOBID}}</td>
              <td>{{props.item.JOBNAME}}</td>
              <td>{{props.item.USER}}</td>
              <td>{{props.item.JOBSTAT}}</td>
              <td>{{props.item.MOTHERNODE}}</td>
              <td v-if="props.item.JOBSTAT === 'RUNNING'">
                <v-btn v-on:click="killjob(props.item.JOBID)" error dark>Kill</v-btn>
              </td>
              <td v-if="props.item.JOBSTAT === 'COMPLETE'">
                <v-btn @click.native.stop="seeresult(props.item.JOBID)" color="teal" dark>Result</v-btn>
                <v-dialog v-model="resultdialog" scrollable max-width="900px">
                  <v-card>
                    <v-card-title>
                      <span class="headline">JOB{{props.item.JOBID}}</span>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-card-text style="height: 600px;">
                      <pre>{{result}}</pre>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="green darken-1" flat="flat" @click="resultdialog = false">Close</v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </td>
            </template>

            <template slot="pageText" slot-scope="{ pageStart, pageStop }">
              From {{ pageStart }} to {{ pageStop }}
            </template>

          </v-data-table>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="close()">Close</v-btn>
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
      pagination: {},
      search: "",
      headers: [
        { text: "Job ID", align: "left", value: "id" },
        { text: "Job Name", align: "left", value: "jobname" },
        { text: "User", align: "left", value: "user" },
        { text: "Job Status", align: "left", value: "status" },
        { text: "Mother Node", align: "left", value: "mothernode" },
        { text: "Operate", align: "left", value: "operate" }
      ],
      items: [],

      result: "",
      resultdialog: false
    };
  },
  methods: {
    open() {
      this.dialog = true;
      this.updatedstat();
    },
    close() {
      this.dialog = false;
    },
    updatedstat() {
      this.items = [];
      API.operatejob(
        this.clustername,
        { op: "jstat" },
        res => {
          if (res.body.hasOwnProperty("JOBID")) {
            for (let i in res.body.JOBID) {
              this.items.push({
                JOBID: res.body.JOBID[i].toString(),
                JOBNAME: res.body.JOBNAME[i],
                USER: res.body.USER[i],
                JOBSTAT: res.body.JOBSTAT[i],
                MOTHERNODE: res.body.MOTHERNODE[i]
              });
            }
          }
        },
        res => {
          alert("Error");
        }
      );
    },
    killjob(jobid) {
      API.operatejob(
        this.clustername,
        { op: "killjob", data: { jobid: jobid } },
        res => {
          this.updatedstat();
        },
        res => {
          alert("Error");
        }
      );
    },
    seeresult(jobid) {
      API.clustergetfile(
        this.clustername,
        "JOB" + jobid + ".OUT",
        res => {
          this.result = res.body;
          this.resultdialog = true;
        },
        res => {
          alert(res.body);
        }
      );
    }
  },
  props: ["clustername", "status"]
};
</script>
