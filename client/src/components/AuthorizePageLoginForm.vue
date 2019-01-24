<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100 center">
        <md-card-header>
          <div class="md-title">LOGIN</div>
        </md-card-header>

        <md-card-content>
          <md-field :class="getValidationClass('email')">
            <label for="emailLogin">Email</label>
            <md-input
              type="email"
              name="email"
              id="emailLogin"
              autocomplete="email"
              v-model="form.email"
              :disabled="sending"
            />
            <span
              class="md-error"
              v-if="!$v.form.email.required"
            >The email is required</span>
            <span
              class="md-error"
              v-else-if="!$v.form.email.email"
            >Invalid email</span>
          </md-field>

          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('password')">
              <label for="passwordLogin">Password</label>
              <md-input
                type="password"
                name="password"
                id="passwordLogin"
                v-model="form.password"
                :disabled="sending"
              />
              <span
                class="md-error"
                v-if="!$v.form.password.required"
              >The password is required</span>
            </md-field>
          </div>
        </md-card-content>

        <md-progress-bar class="md-progress-bar" md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Log in</md-button>
        </md-card-actions>
      </md-card>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import {
  required,
  email,
} from 'vuelidate/lib/validators';

const axios = require('axios');

export default {
  name: 'AuthorizePageSignupForm',
  mixins: [validationMixin],
  data: () => ({
    form: {
      email: null,
      password: null,
    },
    sending: false,
  }),
  validations: {
    form: {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }
      return '';
    },

    saveUser() {
      this.sending = true;

      axios.post('/api', {
        query: `mutation {login (email: "${this.form.email}", password: "${this.form.password}")}`,
      })
        .then((res) => {
          if (res.data.errors) {
            this.sending = false;
            this.cleanPassword();
            this.$noty.error(res.data.errors[0].message);
          } else {
            this.$cookie.set('auth', res.data.data.login, 1);
            axios.defaults.headers.common.Authorization = `Bearer ${res.data.data.login}`;
            this.$store.commit('login', res.data.data.login);
            this.sending = false;
          }
        });
    },

    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
    },

    cleanPassword() {
      this.form.password = null;
      this.$v.form.password.$reset();
    },
  },
};
</script>

<style scoped>
  .md-progress-bar {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
  }
</style>
