<template>
  <div>
    <v-layout row wrap>
      <v-flex xs1>
        <v-subheader>Language</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-select
          v-bind:items="languageitems"
          v-model="language"
          label="Select"
          single-line
          bottom
        ></v-select>
      </v-flex>
      <v-flex xs1>
        <v-subheader>Theme</v-subheader>
      </v-flex>
      <v-flex xs3>
        <v-select
          v-bind:items="themeitems"
          v-model="theme"
          label="Select"
          single-line
          bottom
        ></v-select>
      </v-flex>
      <v-flex xs1>
      </v-flex>
      <v-flex xs3>
        <v-btn v-on:click="cleaneditor" class="indigo white--text" dark>
          <v-icon dark>fa-trash</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
    <!-- Load from webpack (note the srcPath="dist" prop) -->
    <Monaco
        height="600"
        :language="language"
        srcPath="build"
        :code="code"
        :options="options"
        :highlighted="highlightLines"
        :changeThrottle="500"
        :theme="theme"
        @mounted="onMounted"
        @codeChange="onCodeChange"
        >
    </Monaco>
  </div>
</template>

<script>
const Monaco = require("./Monaco.vue");

module.exports = {
  components: {
    Monaco
  },
  data() {
    return {
      languageitems: [],
      languagesinfo: [],
      language: "cpp",
      code: "// type your code \n",
      highlightLines: [
        {
          number: 0,
          class: "primary-highlighted-line"
        },
        {
          number: 0,
          class: "secondary-highlighted-line"
        }
      ],
      theme: "vs",
      themeitems: [
        { text: "Visual Studio", value: "vs" },
        { text: "Visual Studio Dark", value: "vs-dark" },
        { text: "High Contrast Dark", value: "hc-black" }
      ]
    };
  },
  methods: {
    onMounted(editor, monaco) {
      console.log("after mount!", editor, editor.getValue(), editor.getModel());
      this.editor = editor;
      this.monaco = monaco;
      this.languagesinfo = this.monaco.languages.getLanguages();
      for (const i in this.languagesinfo) {
        this.languageitems.push({
          text: this.languagesinfo[i].id,
          value: this.languagesinfo[i].id
        });
      }
    },
    onCodeChange(editor) {
      console.log("code changed!", "code:" + this.editor.getValue());
    },
    clickHandler() {
      console.log("here is the code:", this.editor.getValue());
    },
    cleaneditor() {
      this.editor.setValue(this.code);
    }
  },
  created() {
    this.options = {
      selectOnLineNumbers: false
    };
  }
};
</script>

<style media="screen">
.secondary-highlighted-line {
  background: green;
}
</style>
