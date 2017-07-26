<template>
    <div>
        <h3>Cluster List</h3>
        <v-spacer></v-spacer>
        <v-layout row wrap>
            <v-flex xs1 class="text-xs-right">
                <addcluster :itemlist="items"></addcluster>
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
                    <td>{{ props.item.stat }}</td>
                    <td>
                        <nodelist :node="props.item">
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

export default {
    data () {
        return {
            search: '',
            pagination: {},
            headers: [
                { text: 'Cluster Name', value: 'name', align: 'left' },
                { text: 'Nodes Count', value: 'nodes', align: 'left' },
                { text: 'Port', value: 'port', align: 'left' },
                { text: 'Stat', value: 'stat', align: 'left' },
                { text: 'Operate', align: 'left' }
            ],
            items: [
                {
                    value: false,
                    name: 'ClusterA',
                    port: 5001,
                    nodes: 10,
                    nodeslist: [{ nodename: "lab01", nodenp: 10 }, { nodename: "lab02", nodenp: 9 }],
                    stat: 'Work',
                },
                {
                    value: false,
                    name: 'ClusterB',
                    port: 5003,
                    nodes: 8,
                    nodeslist: [{ nodename: "lab03", nodenp: 10 }, { nodename: "lab04", nodenp: 9 }],
                    stat: 'Work',
                },
                {
                    value: false,
                    name: 'ClusterC',
                    port: 5005,
                    nodes: 9,
                    nodeslist: [{ nodename: "lab05", nodenp: 10 }, { nodename: "lab06", nodenp: 9 }],
                    stat: 'Work',
                },
            ]
        }
    },
    components: {
        'addcluster': AddCluster,
        'nodelist': NodesList,
    }
}
</script>
