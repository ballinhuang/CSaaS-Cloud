<template>
  <div class="fill-height">
    <v-toolbar dark color="primary">
      <v-toolbar-title class="white--text">Editor</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout text-xs-center justify-center>
        <v-flex xs2 offset-xs5>
          <v-subheader>Theme</v-subheader>
        </v-flex>
        <v-flex xs4>
          <v-select v-bind:items="themeitems" v-model="theme" label="Select" single-line bottom></v-select>
        </v-flex>
      </v-layout>
      <v-menu offset-y>
        <v-btn flat slot="activator">
          Save
          <v-icon right dark>far fa-save</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="savetonewfileopen">
            <v-list-tile-title>To New File</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-on:click="$refs['instance2'].open()">
            <v-list-tile-title>To Old File</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!-- Save to new file dialog -->
      <v-dialog v-model="savetonewfiledialog" max-width="500px">
        <v-card>
          <v-card-title class="headline">Save File</v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs4>
                <v-subheader>Select Old Folder</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-select :disabled="inputdirname!==''" v-bind:items="dirlist" v-model="dirselect" label="Select" single-line bottom></v-select>
              </v-flex>
            </v-layout>
            <v-layout row wrap>
              <v-flex xs4>
                <v-subheader>New Folder Name</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field label="Folder name" v-model="inputdirname"></v-text-field>
              </v-flex>
              <v-flex xs4>
                <v-subheader>New File Name</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field label="File name" v-model="inputfilename"></v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn flat="flat" @click.native="closesavetonewfiledialog">Cancle</v-btn>
            <v-btn flat="flat" @click.native="savetonewfile">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn flat @click.native.stop="deletedialog = true">
        New File
        <v-icon right dark>far fa-file-alt</v-icon>
      </v-btn>
      <v-dialog v-model="deletedialog" max-width="290">
        <v-card>
          <v-card-title class="headline">
            <div class="red--text text--darken-2">Alert !</div>
          </v-card-title>
          <v-card-text>Are you sure to clean the editor?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click.native="deletedialog = false">No</v-btn>
            <v-btn color="green darken-1" flat="flat" @click.native="cleaneditor">Yes</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-menu offset-y>
        <v-btn flat slot="activator">
          Cloud
          <v-icon right dark>fas fa-cloud-download-alt</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="$refs['instance1'].open()">
            <v-list-tile-title>Open File</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-on:click="$refs['instance3'].open()">
            <v-list-tile-title>Reomve File</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-on:click="$refs['instance4'].open()">
            <v-list-tile-title>Compile File</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>
      <!--<v-select v-bind:items="languageitems" v-model="language" label="Select" single-line bottom></v-select>-->
    </v-toolbar>
    <v-layout fill-height>
      <Monaco :language="language" srcPath="build" :code="code" :options="options" :highlighted="highlightLines" :changeThrottle="500" :theme="theme" @mounted="onMounted" @codeChange="onCodeChange">
      </Monaco>
    </v-layout>
    <v-layout>
      <ffshelf category-url="../api/dirlist" v-on:confirm="onConfirm" ref="instance1"></ffshelf>
    </v-layout>
    <v-layout>
      <ffshelf category-url="../api/dirlist" v-on:confirm="savetooldfile" ref="instance2"></ffshelf>
    </v-layout>
    <v-layout>
      <ffshelf category-url="../api/dirlist" v-on:confirm="removefile" ref="instance3"></ffshelf>
    </v-layout>
    <v-layout>
      <ffshelf category-url="../api/dirlist" v-on:confirm="compilefile" ref="instance4"></ffshelf>
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
      ],
      deletedialog: false,
      savetonewfiledialog: false,
      dirlist: [],
      dirselect: "",
      inputdirname: "",
      inputfilename: ""
    };
  },
  methods: {
    onMounted(editor, monaco) {
      //console.log("after mount!", editor, editor.getValue(), editor.getModel());
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
      //console.log("code changed!", "code:" + this.editor.getValue());
    },
    clickHandler() {
      //console.log("here is the code:", this.editor.getValue());
    },
    cleaneditor() {
      //this.editor.setValue(this.code);
      this.deletedialog = false;
      this.code = "";
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
    },
    savetonewfileopen() {
      API.getdirlist(
        res => {
          this.dirlist = [];
          for (var i in res.body) {
            this.dirlist.push({
              text: res.body[i].name,
              value: res.body[i].name
            });
          }
          this.savetonewfiledialog = true;
        },
        res => {
          alert(result.body);
        }
      );
    },
    savetonewfile() {
      if (this.inputfilename === "") {
        alert("No input the file's name");
        this.closesavetonewfiledialog();
      }
      if (this.dirselect === "" && this.inputdirname === "") {
        alert("No input the Floder name");
        this.closesavetonewfiledialog();
      }
      var finaldirname = "";
      if (this.inputdirname !== "") {
        finaldirname = this.inputdirname;
      } else {
        finaldirname = this.dirselect;
      }
      API.operatefile(
        `/api/file/${finaldirname}/${this.inputfilename}`,
        {
          operate: "save",
          data: this.editor.getValue()
        },
        res => {
          alert(res.body);
          this.closesavetonewfiledialog();
        },
        res => {
          alert(res.body);
          this.closesavetonewfiledialog();
        }
      );
    },
    savetooldfile: function(files) {
      API.operatefile(
        files[0].fileurl,
        {
          operate: "save",
          data: this.editor.getValue()
        },
        res => {
          alert(res.body);
          this.closesavetonewfiledialog();
        },
        res => {
          alert(res.body);
          this.closesavetonewfiledialog();
        }
      );
    },
    closesavetonewfiledialog() {
      this.savetonewfiledialog = false;
      this.dirselect = "";
      this.inputdirname = "";
      this.inputfilename = "";
    },
    removefile: function(files) {
      for (var i in files) {
        API.operatefile(
          files[i].fileurl,
          {
            operate: "delete"
          },
          res => {},
          res => {}
        );
      }
    },
    compilefile: function(files, modename) {
      var filespath = [];
      for (var i in files) {
        filespath.push(files[i].fileurl);
      }
      var body = {
        files: filespath,
        modename: modename
      };
      API.operatefile(
        body,
        res => {
          alert(res.body);
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
