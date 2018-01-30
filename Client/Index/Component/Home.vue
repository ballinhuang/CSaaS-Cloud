<template>
  <v-layout class="mt-5" fill-height column justify-center align-center>
    <div class="light-blue--text display-4">Hello {{user.name}} !</div>
    <div class="light-blue--text display-3">Welcome to Crown</div>
  </v-layout>
</template>

<script>
import API from "../../WebAPI.js";
export default {
  data() {
    return {
      user: {}
    };
  },
  methods: {},
  beforeCreate: function() {
    API.getUser(
      res => {
        this.user = res.body;
      },
      res => {
        alert("ERROR");
      }
    );
  }
};
</script>
