<template>
    <v-layout row justify-center>
        <v-dialog v-model="dialog" width="500px" persistent>
            <v-btn fab dark class="indigo" slot="activator">
                <v-icon dark>add</v-icon>
            </v-btn>
            <v-card>

                <v-card-title>
                    <span class="headline">AddUser</span>
                </v-card-title>

                <v-card-text>
                    <v-layout row>
                        <v-flex xs4>
                            <v-subheader>Username</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-1" label="username" v-model="newusername"></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <v-flex xs4>
                            <v-subheader>Password</v-subheader>
                        </v-flex>
                        <v-flex xs8>
                            <v-text-field name="input-1" label="passwd" type="password" v-model="newuserpasswd"></v-text-field>
                        </v-flex>
                    </v-layout>

                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="blue--text darken-1" flat @click.native="clean">Close</v-btn>
                    <v-btn class="blue--text darken-1" flat @click.native="adduser">Submit</v-btn>
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
            newusername: "",
            newuserpasswd: ""
        }
    },
    methods: {
        clean () {
            this.dialog = false
            this.newusername = ""
            this.newuserpasswd = ""
        },
        adduser () {
            let msg = {
                username: this.newusername,
                passwd: this.newuserpasswd
            }
            API.adduser(msg, (result) => {
                this.user.users = result.body.users
            }, (result) => {
                this.alertmsg.alert = true
                this.alertmsg.type = "error"
                this.alertmsg.msg = result.body
            })
            this.clean()
        }
    },
    props: ['user', 'alertmsg']
}
</script>