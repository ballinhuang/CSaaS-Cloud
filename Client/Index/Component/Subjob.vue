<template>
    <v-layout row>
        <v-dialog v-model="dialog" persistent>
            <v-btn primary dark slot="activator">Subjob</v-btn>
            <v-card>
                <v-card-title>
                    <span class="headline">Subjob</span>
                </v-card-title>
                <v-card-text>
                    <v-text-field label="Job name" class="mt-5" v-model="filename"></v-text-field>
                    <v-text-field label="Write the scipt" multi-line v-model="script"></v-text-field>
                    <v-select label="Select nodes need" persistent-hint :items="nodeoptions" v-model="nodeneed"></v-select>
                    <v-select label="Select cpu need" persistent-hint :items="cpuoptions" v-model="cpuneed"></v-select>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="blue--text darken-1" flat @click.native="sendjob">Send</v-btn>
                    <v-btn class="blue--text darken-1" flat @click.native="cleanfield">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import API from '../../WebAPI.js'

export default {
    data () {
        return {
            dialog: false,
            nodeoptions: [],
            cpuoptions: [],
            maxcpu: 0,
            cpuneed: 1,
            nodeneed: 0,
            filename: '',
            script: ''
        }
    },
    methods: {
        sendjob () {
            this.script += "\n#SET -N " + this.nodeneed + " -P " + this.cpuneed
            var msg = {
                name: this.cluster.name,
                port: this.cluster.port,
                jobname: this.filename,
                npneed: this.cpuneed,
                nodeneed: this.nodeneed,
                script: this.script
            }
            API.subjob(msg, (res) => {
                //alert(res.body.msg)
                this.alertmsg.msg = res.body.msg
                this.alertmsg.alert = true
                this.alertmsg.type = "success"
            }, (res) => {
                //alert(res.body)
                this.alertmsg.msg = res.body
                this.alertmsg.alert = true
                this.alertmsg.type = "error"
            })
            this.cleanfield()
        },
        cleanfield () {
            this.dialog = false
            this.cpuneed = 0
            this.nodeneed = 0
            this.filename = ''
            this.script = ''
        }
    },
    created: function () {
        var i = 0;
        for (i = 0; i <= parseInt(this.cluster.nodes); i++) {
            this.nodeoptions.push({ value: i, text: i });
        }
        for (var node in this.cluster.nodeslist) {
            if (parseInt(this.cluster.nodeslist[node].nodenp) > this.maxcpu) {
                this.maxcpu = parseInt(this.cluster.nodeslist[node].nodenp)
            }
        }
        for (i = 1; i <= this.maxcpu; i++) {
            this.cpuoptions.push({ value: i, text: i });
        }
    },
    props: ['cluster', 'alertmsg']
}
</script>