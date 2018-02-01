<template>
  <div class="fill-height">
    <v-toolbar dark color="primary">
      <v-toolbar-title class="white--text">Editor</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout text-xs-center justify-center>
        <v-flex xs1 offset-xs6>
          <v-subheader>Theme</v-subheader>
        </v-flex>
        <v-flex xs4>
          <v-select v-bind:items="themeitems" v-model="theme" label="Select" single-line bottom></v-select>
        </v-flex>
      </v-layout>
      <v-btn icon>
        <v-icon>far fa-save</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>far fa-trash-alt</v-icon>
      </v-btn>
      <v-btn flat v-on:click="openFFshelf">
        Open File
        <v-icon right dark>fas fa-cloud-download-alt</v-icon>
      </v-btn>
      <!--<v-select v-bind:items="languageitems" v-model="language" label="Select" single-line bottom></v-select>-->
    </v-toolbar>
    <v-layout fill-height>
      <Monaco :language="language" srcPath="build" :code="code" :options="options" :highlighted="highlightLines" :changeThrottle="500" :theme="theme" @mounted="onMounted" @codeChange="onCodeChange">
      </Monaco>
    </v-layout>
    <v-layout>
      <ffshelf category-url="../api/dirlist" v-on:confirm="onConfirm" ref="instance1"></ffshelf>
    </v-layout>
  </div>
</template>

<script>
const Monaco = require("./Monaco.vue");
import API from "../../../WebAPI.js";
import FFShelf from "./ffshelf.min.js";
module.exports = {
  components: {
    Monaco,
    ffshelf: FFShelf
  },
  data() {
    return {
      languageitems: [],
      languagesinfo: [],
      language: "cpp",
      code:
        '#include "IScheduler.hpp"\n\n' +
        "class [Name] : public IScheduler {\n\n" +
        "\tpublic:\n" +
        "\t\t[Name]();\n" +
        "\t\tdeque<Job> schedule(deque<Job>, deque<Job>, long, deque<Node>);\n\n" +
        "};",
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
      theme: "vs-dark",
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
    },
    openFFshelf: function() {
      this.$refs["instance1"].open();
    },
    onConfirm: function(files) {
      // the "files" parameter is an array contains the file we selected.
      API.getworkfile(
        files[0].fileurl,
        res => {
          this.code = res.body;
        },
        res => {
          alert(res.body);
        }
      );
    }
  },
  beforeCreate() {
    this.options = {
      selectOnLineNumbers: true
    };
  }
};
</script>

<style media="screen">
.secondary-highlighted-line {
  background: green;
}
</style>
