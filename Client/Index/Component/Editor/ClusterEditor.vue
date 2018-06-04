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
          Save
          <v-icon right dark>far fa-save</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="savetonewfiledialog = true">
            <v-list-tile-title>To New File</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-on:click="$refs['filesavelist'].open()">
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
                <v-subheader>New File Name</v-subheader>
              </v-flex>
              <v-flex xs8>
                <v-text-field label="File name" v-model="newfilename"></v-text-field>
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

      <v-menu offset-y>
        <v-btn flat slot="activator">
          Operate
          <v-icon right dark>fas fa-cloud-download-alt</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="$refs['fileopenlist'].open()">
            <v-list-tile-title>Open File</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-on:click="$refs['fileremovelist'].open()">
            <v-list-tile-title>Reomve File</v-list-tile-title>
          </v-list-tile>
          <v-list-tile v-on:click="$refs['filecompilelist'].open()">
            <v-list-tile-title>Compile File</v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-menu>

      <!--<v-select v-bind:items="languageitems" v-model="language" label="Select" single-line bottom></v-select>-->
    </v-toolbar>
    <v-layout fill-height>
      <Monaco :language="language" srcPath="./" :code="code" :options="options" :highlighted="highlightLines" :changeThrottle="500" :theme="theme" @mounted="onMounted" @codeChange="onCodeChange">
      </Monaco>
    </v-layout>
    <v-layout>
      <ffshelf :category-url="'../api/cluster/dirlist/'+clustername" v-on:confirm="onOpenfile" ref="fileopenlist"></ffshelf>
    </v-layout>
    <v-layout>
      <ffshelf :category-url="'../api/cluster/dirlist/'+clustername" v-on:confirm="onRemovefile" ref="fileremovelist"></ffshelf>
    </v-layout>
    <v-layout>
      <ffshelf :category-url="'../api/cluster/dirlist/'+clustername" v-on:confirm="onCompilefile" ref="filecompilelist"></ffshelf>
    </v-layout>
    <v-layout>
      <ffshelf :category-url="'../api/cluster/dirlist/'+clustername" v-on:confirm="onSavefile" ref="filesavelist"></ffshelf>
    </v-layout>
    <!-- Save to new file dialog -->
    <v-dialog v-model="inputargdialog" max-width="500px">
      <v-card>
        <v-card-title class="headline">Compile</v-card-title>
        <v-card-text>

          <v-layout row wrap>
            <v-flex xs4>
              <v-subheader>Compiler</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-select v-bind:items="compilerslist" v-model="complier" label="Select" single-line bottom></v-select>
            </v-flex>
            <v-flex xs4>
              <v-subheader>Argument</v-subheader>
            </v-flex>
            <v-flex xs8>
              <v-text-field label="Argument" v-model="argument"></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn flat="flat" @click.native="closeinputargdialog">Cancle</v-btn>
          <v-btn flat="flat" @click.native="compilefile">Compile</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      language: "c",
      code: "// Inpute your codes.",
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
      inputargdialog: false,
      savetonewfiledialog: false,

      compilerslist: [{ text: "gcc" }, { text: "g++" }, { text: "mpicc" }],

      newfilename: "",
      argument: "",
      complier: "",
      filestemp: [],

      user: {},
      clustername: "",
      cluster: {}
    };
  },
  methods: {
    onMounted(editor, monaco) {
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
    onOpenfile: function(files) {
      API.clustergetfile(
        this.clustername,
        files[0].filename,
        res => {
          this.code = res.body;
        },
        res => {
          alert(res.body);
        }
      );
    },
    savetonewfile() {
      if (this.inputfilename === "") {
        alert("No input the file's name");
        this.closesavetonewfiledialog();
      }

      API.clusteroperatefile(
        this.clustername,
        {
          operate: "write",
          data: {
            filename: this.newfilename,
            content: this.editor.getValue()
          }
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
    onSavefile: function(files) {
      API.clusteroperatefile(
        this.clustername,
        {
          operate: "write",
          data: {
            filename: files[0].filename,
            content: this.editor.getValue()
          }
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
      this.newfilename = "";
    },
    onRemovefile: function(files) {
      for (var i in files) {
        API.clusteroperatefile(
          this.clustername,
          {
            operate: "remove",
            data: {
              filename: files[i].filename
            }
          },
          res => {
            alert(res.body);
          },
          res => {
            alert(res.body);
          }
        );
      }
    },
    onCompilefile: function(files) {
      this.filestemp = files;
      this.inputargdialog = true;
    },
    closeinputargdialog() {
      this.inputargdialog = false;
      this.filestemp = [];
      this.complier = "";
      this.argument = "";
    },
    compilefile() {
      if (this.complier === "") {
        this.closeinputargdialog();
      }
      var files = "";
      for (var i in this.filestemp) {
        files += this.filestemp[i].filename + " ";
      }
      API.clusteroperatefile(
        this.clustername,
        {
          operate: "compile",
          data: {
            compiler: this.complier.text,
            argc: this.argument,
            files: files
          }
        },
        res => {
          this.closeinputargdialog();
          alert(res.body);
        },
        res => {
          this.closeinputargdialog();
          alert(res.body);
        }
      );
    }
  },
  beforeCreate() {
    this.options = {
      selectOnLineNumbers: true
    };
    API.getUser(
      res => {
        this.user = res.body;
        if (this.$route.params.clustername !== undefined)
          this.clustername = this.$route.params.clustername;
        for (var i in this.user.clusters) {
          if (this.user.clusters[i].name === this.clustername) {
            this.cluster = this.user.clusters[i];
          }
        }
      },
      res => {
        alert("ERROR");
      }
    );
  }
};
</script>

<style media="screen">
.secondary-highlighted-line {
  background: green;
}
</style>
