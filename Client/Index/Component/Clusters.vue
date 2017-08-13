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
                        <v-layout row>
                            <nodelist :node="props.item.nodeslist">
                            </nodelist>
                            <subjob :cluster="props.item">
                            </subjob>
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
import AddCluster from './AddCluster.vue'
import NodesList from './NodesList.vue'
import API from '../../WebAPI.js'
import Subjob from './Subjob.vue'

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
        'subjob': Subjob
    },
    beforeCreate: function () {
        API.getUser((res) => {
            this.items = res.body.clusters;
        }, (res) => {
            alert("ERROR");
        });
    }
}
</script>

