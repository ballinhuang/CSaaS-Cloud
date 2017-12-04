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
              <p v-for="d in data" :key="d">
                {{d}}
              </p>
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
      dialog: false
    };
  },
  props: ["data"]
};
</script>
