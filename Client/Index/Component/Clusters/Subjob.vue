<template>
  <div>
    <v-btn class="primary" dark @click.native.stop="dialog=true">Job Submission</v-btn>
    <v-dialog v-model="dialog" width="800px">

      <v-card>
        <v-card-title>
          <span class="headline">Job Submission</span>
        </v-card-title>
        <v-card-text>

          <v-text-field label="Job name" v-model="filename"></v-text-field>
          <v-text-field label="Write the scipt" multi-line v-model="script"></v-text-field>
          <v-text-field label="Runtime" type="Number" v-model="runtime"></v-text-field>
          <v-layout row>
            <v-flex xs4>
              <v-checkbox v-bind:label="`Parallel Job: ${ex2.toString()}`" @change="cleanParallel" v-model="ex2" light></v-checkbox>
            </v-flex>
            <v-flex xs4>
              <v-checkbox v-bind:label="`MPI Support: ${ex1.toString()}`" v-show="ex2" v-model="ex1" light></v-checkbox>
            </v-flex>
          </v-layout>
          <v-select v-show="ex2" label="Select nodes needed" persistent-hint @input="initcpuoptions" :items="nodeoptions" v-model="nodeneed"></v-select>
          <v-select v-show="ex2" label="Cpu per node" persistent-hint :items="cpuoptions" v-model="cpuneed"></v-select>

        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="blue--text darken-1" flat @click.native="cleanfield">Close</v-btn>
          <v-btn class="blue--text darken-1" flat @click.native="sendjob">Submit</v-btn>
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
      nodeoptions: [],
      cpuoptions: [],
      maxcpu: 0,
      totalcpu: 0,
      cpuneed: 1,
      nodeneed: 0,
      filename: "",
      script: "",
      runtime: 0,
      ex1: false,
      ex2: false
    };
  },
  methods: {
    sendjob() {
      if (this.cluster.username == "") {
        alert("User has not been set.");
        return;
      }
      if (this.filename == "" || this.script == "") {
        alert("Job name and script can not be null.");
        return;
      }
      this.script += "\n#SET -N " + this.nodeneed + " -P " + this.cpuneed;
      this.script += "\n#RUNTIME " + this.runtime;
      if (this.ex1 === true) {
        this.script += "\n#MPI";
      }
      var msg = {
        name: this.cluster.name,
        jobname: this.filename,
        npneed: this.cpuneed,
        nodeneed: this.nodeneed,
        script: this.script
      };
      API.subjob(
        msg,
        res => {
          this.alertmsg.msg = res.body.msg;
          this.alertmsg.alert = true;
          this.alertmsg.type = "success";
        },
        res => {
          this.alertmsg.msg = res.body.msg;
          this.alertmsg.alert = true;
          this.alertmsg.type = "error";
        }
      );
      this.cleanfield();
    },
    cleanfield() {
      this.dialog = false;
      this.cpuneed = 1;
      this.nodeneed = 0;
      this.filename = "";
      this.script = "";
      this.runtime = 0;
      this.ex1 = false;
      this.ex2 = false;
    },
    initcpuoptions() {
      this.cpuoptions = [];
      var i = 1;
      if (this.nodeneed !== 0) {
        for (i = 1; i <= this.maxcpu; i++) {
          this.cpuoptions.push({ value: i, text: i });
        }
      } else {
        for (i = 1; i <= this.totalcpu; i++) {
          this.cpuoptions.push({ value: i, text: i });
        }
      }
    },
    cleanParallel() {
      if (this.ex2 === false) {
        this.ex1 = false;
        this.cpuneed = 1;
        this.nodeneed = 0;
      }
    }
  },
  created: function() {
    var i = 0;
    this.nodeoptions.push({ value: i, text: "Free" });
    for (i = 1; i <= parseInt(this.cluster.nodes); i++) {
      this.nodeoptions.push({ value: i, text: i });
    }
    for (var node in this.cluster.nodeslist) {
      this.totalcpu += parseInt(this.cluster.nodeslist[node].nodenp);
      if (parseInt(this.cluster.nodeslist[node].nodenp) > this.maxcpu) {
        this.maxcpu = parseInt(this.cluster.nodeslist[node].nodenp);
      }
    }
    this.initcpuoptions();
  },
  props: ["cluster", "alertmsg"]
};
</script>