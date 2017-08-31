<template>
    <v-dialog v-model="dialog" width="800px">
        <v-btn primary dark slot="activator">Node List</v-btn>
        <v-card>
            <v-card-title>
                <span class="headline">Node List</span>
            </v-card-title>
            <v-card-text>

                <v-data-table v-bind:headers="headers" :items="node" hide-actions class="elevation-1">
                    <template slot="items" scope="props">
                        <td>{{ props.item.nodename }}</td>
                        <td>{{ props.item.nodeip }}</td>
                        <td>{{ props.item.nodeport }}</td>
                        <td>{{ props.item.nodenp }}</td>
                    </template>
                </v-data-table>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="blue--text darken-1" flat @click.native="dialog = false">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data () {
        return {
            headers: [
                { text: 'Node name', value: 'nodename', align: 'left' },
                { text: 'IP', value: 'ip', align: 'left' },
                { text: 'Port', value: 'port', align: 'left' },
                { text: 'CPU', value: 'nodenp', align: 'left' }
            ],
            dialog: false
        }
    },
    props: ['node']
}
</script>