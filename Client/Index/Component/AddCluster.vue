<template>
    <div>
        <v-layout row>
            <v-dialog v-model="dialog" persistent>
                <v-btn fab dark class="indigo" slot="activator">
                    <v-icon dark>add</v-icon>
                </v-btn>
                <v-card>
                    <v-card-title>
                        <span class="headline">Add new Cluster</span>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field label="Cluster Name" required v-model="item.name"></v-text-field>
                        <v-text-field type="Number" label="Cluster Nodes Count" required v-model="item.nodes"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn class="blue--text darken-1" flat @click.native="dialog = false">Close</v-btn>
                        <v-btn class="blue--text darken-1" flat v-on:click="additem">Save</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-layout>
    </div>
</template>

<script>
export default {
    data () {
        return {
            dialog: false,
            item: {
                name: '',
                nodes: 0,
                port: 0,
                stat: ''
            }
        }
    },
    methods: {
        additem (event) {
            if (this.item.name === '' || this.item.nodes === '') {
                this.dialog = true;
                return;
            }
            this.item.port = 5000;
            this.item.stat = 'Work';
            this.itemlist.push(JSON.parse(JSON.stringify(this.item)));
            this.dialog = false;
            this.cleanitem();
        },
        cleanitem () {
            this.item.name = '';
            this.item.nodes = 0;
            this.item.port = 0;
            this.item.stat = '';
        }
    },
    props: ['itemlist']
}
</script>