<template>
    <center>
        <img src="../../build/CSAAS.png" />
        <div class="container">
            <div class="z-depth-1 grey lighten-4 row" style="width:35%;display: inline-block; padding: 32px 48px 0px 48px; border: 1px solid #EEE;">
                <form class="col s12">
                    <div class='row'>
                        <div class='col s12'>
                        </div>
                    </div>
    
                    <div class='row'>
                        <div class='input-field col s12'>
                            <input class='validate' type='text' v-model="name" />
                            <label for='email'>Enter your name</label>
                        </div>
                    </div>
    
                    <div class='row'>
                        <div class='input-field col s12'>
                            <input class='validate' type='password' v-model="passwd" />
                            <label for='password'>Enter your password</label>
                        </div>
                    </div>
    
                    <br />
                    <center>
                        <div class='row'>
                            <button v-on:click="login" class='cyan col s12 btn btn-large waves-effect indigo'>Login</button>
                        </div>
                    </center>
                </form>
            </div>
        </div>
    </center>
</template>

<script>
export default {
    data () {
        return {
            name: "",
            passwd: ""
        }
    },
    methods: {
        login: function (event) {
            this.$http.post('/login', { 'name': this.name, 'passwd': this.passwd }).then(response => {
                window.location.href = response.body.redirect;
            }, response => {
                // error callback
            });
            this.name = "";
            this.passwd = ""
        }
    }
}
</script>

<style>
.input-field input[type=date]:focus+label,
.input-field input[type=text]:focus+label,
.input-field input[type=email]:focus+label,
.input-field input[type=password]:focus+label {
    color: #e91e63;
}

.input-field input[type=date]:focus,
.input-field input[type=text]:focus,
.input-field input[type=email]:focus,
.input-field input[type=password]:focus {
    border-bottom: 2px solid #e91e63;
    box-shadow: none;
}
</style>