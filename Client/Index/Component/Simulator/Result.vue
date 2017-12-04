<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" width="800px" scrollable>
      <v-btn primary dark slot="activator">Result</v-btn>
      <v-card>
        <v-card-title>
          <span class="headline">Result</span>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat="flat" @click.native="dialog = false">Close</v-btn>
        </v-card-title>
        <v-divider></v-divider>
          <v-card-text style="height: 800px;">
            <v-data-table
              v-if="dialog"
              v-bind:headers="headers"
              :items="results"
              hide-actions
              class="elevation-1"
            >
              <template slot="items" scope="props">
                <td class="text-xs-center">{{ props.item.jobid }}</td>
                <td class="text-xs-center">{{ props.item.subt }}</td>
                <td class="text-xs-center">{{ props.item.runt }}</td>
                <td class="text-xs-center">{{ props.item.waitt }}</td>
                <td class="text-xs-center">{{ props.item.np }}</td>
                <td class="text-xs-center">{{ props.item.order }}</td>
              </template>
            </v-data-table>
          </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
      results: [],
      headers: [
        { text: "Job ID", value: "jobid", align: "center" },
        { text: "Submit time", value: "subt", align: "center" },
        { text: "Run time", value: "runt", align: "center" },
        { text: "Wait time", value: "waitt", align: "center" },
        { text: "NP", value: "np", align: "center" },
        { text: "Order", value: "order", align: "center" }
      ]
    };
  },
  watch: {
    data: function() {
      this.results = [];
      for (var i in this.data) {
        const row = this.data[i].split(" ");
        this.results.push({
          jobid: row[1],
          subt: row[2],
          runt: row[3],
          waitt: row[4],
          np: row[5],
          order: row[6]
        });
      }
    }
  },
  props: ["data"]
};
</script>
