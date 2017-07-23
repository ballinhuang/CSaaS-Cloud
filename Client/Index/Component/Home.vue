<template>
  <div class="container">
    <button v-on:click="logout">logout</button>
  </div>
</template>

<script>
import API from '../../WebAPI.js'
export default {
  data () {
    return {
    }
  },
  methods: {
    logout: function (event) {
      API.logout();
    }
  }
}
</script>
