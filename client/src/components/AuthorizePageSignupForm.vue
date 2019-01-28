<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateUser">
      <md-card class="md-layout-item md-size-50 md-small-size-100 center">
        <md-card-header>
          <div class="md-title">SIGN UP</div>
        </md-card-header>

        <md-card-content>
          <div class="md-layout md-gutter">
            <div class="md-layout-item md-small-size-100">
              <md-field :class="getValidationClass('username')">
                <label for="username">Username</label>
                <md-input
                  name="username"
                  id="username"
                  v-model="form.username"
                  :disabled="sending"
                />
                <span
                  class="md-error"
                  v-if="!$v.form.username.required"
                >The Username is required</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.username.minLength"
                >Username is too short</span>
                <span
                  class="md-error"
                  v-else-if="!$v.form.username.maxLength"
                >Invalid is too long</span>
              </md-field>
            </div>
          </div>

          <md-field :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              type="email"
              name="email"
              id="email"
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
              <label for="password">Password</label>
              <md-input
                type="password"
                name="password"
                id="password"
                v-model="form.password"
                :disabled="sending"
              />
              <span
                class="md-error"
                v-if="!$v.form.password.required"
              >The password is required</span>
              <span
                class="md-error"
                v-else-if="!$v.form.password.minlength"
              >Password should contain at least 6 characters</span>
            </md-field>
          </div>
        </md-card-content>

        <md-progress-bar class="md-progress-bar" md-mode="indeterminate" v-if="sending" />

        <md-card-actions>
          <md-button type="submit" class="md-primary" :disabled="sending">Create user</md-button>
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
  minLength,
  maxLength,
} from 'vuelidate/lib/validators';

const axios = require('axios');

export default {
  name: 'AuthorizePageSignupForm',
  mixins: [validationMixin],
  data: () => ({
    form: {
      username: null,
      email: null,
      password: null,
    },
    sending: false,
    lastUser: null,
  }),
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(64),
      },
      email: {
        required,
        email,
        maxLength: maxLength(128),
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(64),
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

    signUp() {
      this.sending = true;

      axios.post('/api', {
        query: `mutation {signup (email: "${this.form.email}", password: "${this.form.password}", username: "${this.form.username}")}`,
      })
        .then((res) => {
          if (res.data.errors) {
            this.sending = false;
            this.$noty.error(res.data.errors[0].message);
          } else {
            this.$cookie.set('auth', res.data.data.signup, 1);
            this.$store.commit('login', res.data.data.signup);
            this.lastUser = `${this.form.username}`;
            this.sending = false;
            this.$noty.success(`The user ${this.lastUser} was saved successfully!`);
          }
        });
    },

    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.signUp();
      }
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
