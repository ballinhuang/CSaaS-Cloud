<template>
    <v-layout row wrap>
        <v-flex xs6>
            <h3>Change Password</h3>
            <v-form v-model="valid">
                <v-text-field label="New password" :append-icon="e1 ? 'visibility' : 'visibility_off'" :append-icon-cb="() => (e1 = !e1)" :type="e1 ? 'text' : 'password'" v-model="newpassword" :rules="newpasswordRules" required></v-text-field>
                <v-text-field label="Enter again" v-model="check" :type="'password'" :rules="checkRules " required></v-text-field>
                <v-btn @click="Save " :class="{ green: valid, red: !valid } ">Save</v-btn>
            </v-form>

        </v-flex>
    </v-layout>
</template>
<script>
import API from "../../../WebAPI.js";
export default {
  data() {
    return {
      e1: false,
      valid: false,
      newpassword: "",
      newpasswordRules: [
        v => !!v || "Name is required",
        v =>
          /[A-Za-z0-9]/.test(v) ||
          "Password need to be numeric or alfanumeric.",
        v => v.length >= 6 || "Name must be more than 6 characters"
      ],
      check: "",
      checkRules: [
        v => v === this.newpassword || "Error! Not the same password."
      ]
    };
  },
  methods: {
    Save() {
      if (!this.valid) {
        return;
      }
      const msg = {
        newpasswd: this.newpassword
      };
      API.changepasswd(
        msg,
        res => {
          API.logout();
        },
        res => {
          alert(res.body);
        }
      );
    }
  },
  props: ["user"]
};
</script>
