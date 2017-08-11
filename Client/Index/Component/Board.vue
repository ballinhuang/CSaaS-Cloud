<template>
    <div>
        <h3>Cluster List</h3>
        <v-spacer></v-spacer>
        <v-layout row wrap>
            <v-flex xs1 class="text-xs-right">
                <addcluster :clusters="items"></addcluster>
            </v-flex>
            <v-flex xs5 offset-xs6>
                <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field>
            </v-flex>
        </v-layout>
        <v-card>
            <v-data-table v-bind:headers="headers" v-bind:items="items" v-bind:search="search">
                <template slot="items" scope="props">
                    <td>{{ props.item.name }}</td>
                    <td>{{ props.item.nodes }}</td>
                    <td>{{ props.item.port }}</td>
                    <td>{{ props.item.scheduler }}</td>
                    <td>{{ props.item.stat }}</td>
                    <td>
                        <nodelist :node="props.item.nodeslist">
                        </nodelist>
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
import AddCluster from './AddCluster.vue'
import NodesList from './NodesList.vue'
import API from '../../WebAPI.js'

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
                { text: 'State', value: 'stat', align: 'left' },
                { text: 'Operate', align: 'left' }
            ],
            items: []
        }
    },
    components: {
        'addcluster': AddCluster,
        'nodelist': NodesList,
    },
    beforeCreate: function () {
        API.getUser((res) => {
            this.items = res.body.clusters;
        }, (res) => {
            alert("ERROR");
        });
    }
}

/*
[
                {
                    name: 'ClusterA',
                    port: 5001,
                    nodes: 10,
                    nodeslist: [
                        { nodename: "lab01", nodeip: '127.0.0.1', nodeport: 50001, nodenp: 10 },
                        { nodename: "lab02", nodeip: '127.0.0.1', nodeport: 50001, nodenp: 9 }
                    ],
                    stat: 'Work',
                    scheduler: 'FIFO'
                },
                {
                    name: 'ClusterB',
                    port: 5003,
                    nodes: 8,
                    nodeslist: [
                        { nodename: "lab03", nodeip: '127.0.0.1', nodeport: 50002, nodenp: 10 },
                        { nodename: "lab04", nodeip: '127.0.0.3', nodeport: 50001, nodenp: 9 }
                    ],
                    stat: 'Work',
                    scheduler: 'Easy'
                },
                {
                    name: 'ClusterC',
                    port: 5005,
                    nodes: 9,
                    nodeslist: [
                        { nodename: "lab05", nodeip: '127.0.0.1', nodeport: 50001, nodenp: 10 },
                        { nodename: "lab06", nodeip: '127.0.0.2', nodeport: 50003, nodenp: 9 }
                    ],
                    stat: 'Work',
                    scheduler: 'Backfilling'
                },
            ] */
</script>

