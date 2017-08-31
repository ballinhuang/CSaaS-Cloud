<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent>
            <v-btn primary dark slot="activator" v-on:click="open">Open Dialog</v-btn>
            <v-card>
                <v-card-title>
                    <span class="headline">User Profile</span>
                </v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12 md6>
                            <v-card class="elevation-0">
                                <v-card-text>
                                    <p>{{ newclustersset }}</p>
                                    <v-checkbox v-for="cluster in user.clusters" :key="cluster.name" :label="cluster.name" v-model="newclustersset" :value="cluster.name"></v-checkbox>
                                </v-card-text>
                            </v-card>
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
    </v-layout>
</template>

<script>
import API from '../../../WebAPI.js'

export default {
    data () {
        return {
            dialog: false,
            newclustersset: []
        }
    },
    methods: {
        open () {
            this.newclustersset = []
            for (const usercluster in this.clusters) {
                this.newclustersset.push(this.clusters[usercluster].name)
            }
        },
        clean () {
            this.dialog = false
            this.newclustersset = []
        },
        save () {
            const msg = {
                username: this.username,
                clusterlist: this.newclustersset
            }
            API.setcluster(msg, (result) => {
                this.user.users = result.body.users
            }, (result) => {
                this.alertmsg.alert = true
                this.alertmsg.type = "error"
                this.alertmsg.msg = result.body
            })
            this.clean()
        }
    },
    props: ['username', 'clusters', 'user', 'alertmsg']
}
</script>