<template>
    <div>
        <v-layout row wrap>
            <v-flex xs1 class="text-xs-right">
                <adduser :user="user" :alertmsg="alertmsg"></adduser>
            </v-flex>
            <v-flex xs5 offset-xs6>
                <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
            </v-flex>
        </v-layout>
        <v-alert :class="alertmsg.type" transition="scale-transition" v-model="alertmsg.alert">
            <v-layout row wrap>
                <v-flex xs11>
                    {{alertmsg.msg}}
                </v-flex>
                <v-flex xs1>
                    <v-btn dark flat v-on:click.native="cleanalert">close</v-btn>
                </v-flex>
            </v-layout>
        </v-alert>
        <v-card>
            <v-data-table v-bind:headers="headers" v-bind:items="user.users" v-bind:search="search">
                <template slot="items" scope="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.passwd }}</td>
                </template>
                <template slot="pageText" scope="{ pageStart, pageStop }">
                    From {{ pageStart }} to {{ pageStop }}
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>

<script>
import API from '../../WebAPI.js'
import Adduser from './Profile/AddUser.vue'

export default {
    data () {
        return {
            search: '',
            headers: [
                { text: 'User Name', value: 'username', align: 'left' },
                { text: 'Passwd', value: 'passwd', align: 'left' },
                { text: 'Operate', value: 'port', align: 'left' },
            ],
            user: {},
            alertmsg: { alert: false, type: "", msg: "" },
            pagination: {},
        }
    },
    methods: {
        cleanalert () {
            this.alertmsg.msg = ""
            this.alertmsg.alert = false
        }
    },
    components: {
        adduser: Adduser
    },
    beforeCreate: function () {
        API.getUser((res) => {
            this.user = res.body;
        }, (res) => {
            alert("ERROR");
        });
    }
}
</script>

