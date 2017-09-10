<template>
    <div>
        <h3>Cluster List</h3>
        <v-spacer></v-spacer>
        <v-layout row wrap>
            <v-flex xs1 class="text-xs-right">
                <addcluster v-show="ismanager" :user="user"></addcluster>
            </v-flex>
            <v-flex xs5 class="pb-3" offset-xs6>
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
            <v-data-table v-bind:headers="headers" v-bind:items="user.clusters" v-bind:search="search">
                <template slot="items" scope="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.nodes }}</td>
                    <td>{{ props.item.port }}</td>
                    <td>{{ props.item.scheduler }}</td>
                    <td>{{ props.item.status }}</td>
                    <td>
                        <v-layout row>
                            <nodelist :node="props.item.nodeslist">
                            </nodelist>
                            <subjob v-show="!ismanager" :cluster="props.item" :alertmsg="alertmsg">
                            </subjob>
                            <usersetting v-show="!ismanager" :user="user" :cluster="props.item" :alertmsg="alertmsg">
                            </usersetting>
                        </v-layout>
                    </td>
                </template>
                <template slot="pageText" scope="{ pageStart, pageStop }">
                    From {{ pageStart }} to {{ pageStop }}
                </template>
            </v-data-table>
        </v-card>
    </div>
</template>


<script>
import API from '../../../WebAPI.js'

import AddCluster from './AddCluster.vue'
import NodesList from './NodesList.vue'
import Subjob from './Subjob.vue'
import UserSetting from './UserSetting.vue'

export default {
    data () {
        return {
            search: '',
            pagination: {},
            headers: [
                { text: 'Cluster Name', value: 'name', align: 'left' },
                { text: 'Node Count', value: 'nodes', align: 'left' },
                { text: 'Port', value: 'port', align: 'left' },
                { text: 'Scheduling mode', value: 'scheduler', align: 'left' },
                { text: 'Status', value: 'status', align: 'left' },
                { text: 'Operate', align: 'left' }
            ],
            user: {},
            alertmsg: { alert: false, type: "", msg: "" },
            ismanager: false
        }
    },
    methods: {
        cleanalert () {
            this.alertmsg.msg = ""
            this.alertmsg.alert = false
        }
    },
    components: {
        'addcluster': AddCluster,
        'nodelist': NodesList,
        'subjob': Subjob,
        'usersetting': UserSetting
    },
    beforeCreate: function () {
        API.getUser((res) => {
            this.user = res.body;
            if (this.user.authority.type === "manager") {
                this.ismanager = true
            }
        }, (res) => {
            alert("ERROR");
        });
    }
}
</script>

