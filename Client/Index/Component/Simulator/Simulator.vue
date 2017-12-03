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
        <v-flex xs2>
          <v-subheader>Select Log</v-subheader>
        </v-flex>
        <v-flex xs2>
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
          <result v-show="props.item.status === 'complete'"></result>
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
      cluster_items: [
        {
          value: "GPU",
          text: "GPU"
        },
        {
          value: "Lab",
          text: "Lab"
        }
      ],
      cluster_model: "",
      log_items: [],
      log_model: "",
      NPs: 0,
      headers: [
        { text: "Algorithm", value: "alogrithm", align: "center" },
        { text: "Time1", value: "time1", align: "center" },
        { text: "Time2", value: "time2", align: "center" },
        { text: "Status", value: "status", align: "center", sortable: false }
      ],
      loader: null,
      loading: false,
      results: [
        { alogrithm: "FIFO", time1: 0, time2: 0, status: "None" },
        { alogrithm: "SJF", time1: 0, time2: 0, status: "None" }
      ]
    };
  },
  watch: {
    cluster_model: function() {
      this.log_items = [];
      if (this.cluster_model === "GPU") {
        this.log_items.push({ value: "Log GPU", text: "Log GPU" });
      } else {
        this.log_items.push({ value: "Log LAB", text: "Log LAB" });
      }
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
      this.results[0].time1 = 10;
      this.results[0].time2 = 11;
      this.results[0].status = "complete";
      this.results[1].status = "progress";
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => (this[l] = false), 3000);
      this.loader = null;
    }
  }
};
</script>
