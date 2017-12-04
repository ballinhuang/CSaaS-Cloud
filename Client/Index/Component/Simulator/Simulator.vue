<template>
<div>
  <h3>Simulation</h3>
        <v-spacer></v-spacer>
  <v-card>
    <v-card-text>
      <v-container fluid>
      <v-layout row wrap>
        <v-flex xs2>
          <v-subheader>Select Cluster</v-subheader>
        </v-flex>
        <v-flex xs2>
          <v-select
            v-bind:items="cluster_items"
            v-model="cluster_model"
            label="Select"
            single-line
            bottom
          ></v-select>
        </v-flex>
        <v-flex xs1>
          <v-subheader>Select Log</v-subheader>
        </v-flex>
        <v-flex xs3>
          <v-select
            v-bind:items="log_items"
            v-model="log_model"
            label="Select"
            single-line
            bottom
            :disabled="selectcluster"
          ></v-select>
        </v-flex>
        <v-flex xs1>
          <v-subheader>NP</v-subheader>
        </v-flex>
        <v-flex xs1>
          <v-text-field
              label="NPs"
              single-line
              type="Number"
              v-model="NPs"
          ></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-btn
            info
            :loading="loading"
            @click.native="start"
            :disabled="loading"
          >
            Start
          </v-btn>
        </v-flex>
      </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
  <v-data-table
      v-bind:headers="headers"
      :items="results"
      class="elevation-1"
    >
    <template slot="items" scope="props">
      <td class="text-xs-center">{{ props.item.alogrithm }}</td>
      <td class="text-xs-center">{{ props.item.time1 }}</td>
      <td class="text-xs-center">{{ props.item.time2 }}</td>
      <td class="text-xs-center">
          <p v-show="props.item.status === 'None'">{{ props.item.status }}</p>
          <v-progress-circular v-show="props.item.status === 'progress'" indeterminate class="primary--text"></v-progress-circular>
          <result :data="props.item.data" v-show="props.item.status === 'complete'"></result>
      </td>
    </template>
  </v-data-table>
</div>
</template>

<script>
import API from "../../../WebAPI.js";
import Result from "./Result.vue";
export default {
  data() {
    return {
      cluster_items: [],
      cluster_model: "",
      log_items: [],
      log_model: "",
      NPs: 0,
      headers: [
        { text: "Algorithm", value: "alogrithm", align: "center" },
        { text: "Average waiting time", value: "time1", align: "center" },
        { text: "Average turnaround time", value: "time2", align: "center" },
        { text: "Status", value: "status", align: "center", sortable: false }
      ],
      loader: null,
      loading: false,
      results: []
    };
  },
  watch: {
    cluster_model: function() {
      this.log_items = [];
      API.getfile(
        "L" + this.cluster_model,
        res => {
          this.log_items = [];
          res.body.forEach(element => {
            this.log_items.push({
              value: element,
              text: element
            });
          });
        },
        res => {
          alert("ERROR");
        }
      );
    }
  },
  computed: {
    selectcluster: function() {
      if (this.cluster_model === "") return true;
      else return false;
    }
  },
  components: {
    result: Result
  },
  methods: {
    start: function() {
      this.loader = "loading";
      this.loading = true;

      for (var i in this.results) {
        this.results[i].status = "progress";
        this.sim(i);
      }
    },
    sim: function(index) {
      API.sim(
        {
          clustername: this.cluster_model,
          log: this.log_model,
          mode: this.results[index].alogrithm,
          np: this.NPs
        },
        res => {
          this.results[index].status = "complete";
          this.results[index].time1 = res.body[0];
          this.results[index].time2 = res.body[1];
          res.body.splice(0, 2);
          this.results[index].data = res.body;

          if (index == this.results.length - 1) {
            this.loading = false;
            this.loader = null;
          }
        },
        res => {
          if (index == this.results.length - 1) {
            this.loading = false;
            this.loader = null;
          }
          this.results[index].status = "complete";
          alert(res.body);
        }
      );
    }
  },
  beforeCreate: function() {
    API.getfile(
      "Clusterslist",
      res => {
        this.cluster_items = [];
        res.body.forEach(element => {
          this.cluster_items.push({
            value: element,
            text: element
          });
        });
      },
      res => {
        alert("ERROR");
      }
    );
    API.getfile(
      "Sim",
      res => {
        this.results = [];
        res.body.forEach(element => {
          this.results.push({
            alogrithm: element,
            time1: 0,
            time2: 0,
            data: [],
            status: "None"
          });
        });
      },
      res => {
        alert("ERROR");
      }
    );
  }
};
</script>
