<template>
    <div class="container">
        <input v-model="name">
        <input v-model="passwd">
        <button v-on:click="greet">Greet</button>
    </div>
</template>

<script>
import jq from 'jquery';
export default {
    data () {
        return {
            name: "",
            passwd: ""
        }
    },
    methods: {
        greet: function (event) {
            const name = this.name;
            const passwd = this.passwd;
            jq.post('/login', { name, passwd }, (data) => {
                window.location.href = data.redirect;
            });
            this.name = "";
            this.passwd = ""
        }
    }
}
</script>

