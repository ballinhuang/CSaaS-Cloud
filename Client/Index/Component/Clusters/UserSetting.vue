<template>
    <v-dialog v-model="dialog" width="500px" persistent>
        <v-btn class="primary" dark slot="activator" v-on:click="init">Setting</v-btn>
        <v-card>

            <v-card-title>
                <span class="headline">Cluster's User Setting</span>
            </v-card-title>

            <v-card-text>
                <v-layout row>
                    <v-flex xs4>
                        <v-subheader>Username</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-1" v-model="newusername"></v-text-field>
                    </v-flex>
                </v-layout>
                <v-layout row>
                    <v-flex xs4>
                        <v-subheader>Password</v-subheader>
                    </v-flex>
                    <v-flex xs8>
                        <v-text-field name="input-1" :type="visible ? 'text' : 'password'" :append-icon="visible ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (visible = !visible)" v-model="newuserpasswd"></v-text-field>
                    </v-flex>
                </v-layout>

            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="blue--text darken-1" flat @click.native="clean">Close</v-btn>
                <v-btn class="blue--text darken-1" flat @click.native="save">Save</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import API from '../../../WebAPI.js'

export default {
    data () {
        return {
            dialog: false,
            newusername: "",
            newuserpasswd: "",
            visible: false
        }
    },
    methods: {
        clean () {
            this.dialog = false
            this.init()
        },
        save () {
            const msg = {
                clustername: this.cluster.name,
                newusername: this.newusername,
                newuserpasswd: this.newuserpasswd
            }
            API.setclusteruser(msg, (result) => {
                this.user.clusters = result.body.clusters
            }, (result) => {
                this.alertmsg.msg = result.body.msg
                this.alertmsg.alert = true
                this.alertmsg.type = "error"
            })
            this.clean()
        },
        init () {
            this.visible = false
            this.newusername = this.cluster.username
            this.newuserpasswd = this.cluster.passwd
        }
    },
    created () {
        this.clean()
    },
    props: ['user', 'cluster', 'alertmsg']
}
</script>