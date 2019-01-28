<template>
  <div>
    <div class="center">
      <div>{{this.msg}}</div>
      <div>User data:</div>
      <p>Username: {{this.username}}</p>
      <p>Email: {{this.email}}</p>

      <md-speed-dial class="md-bottom-right">
        <md-speed-dial-target class="md-primary">
          <md-icon class="add">edit</md-icon>
        </md-speed-dial-target>

        <md-speed-dial-content>
          <md-button class="md-icon-button add">
            <md-icon>add</md-icon>
          </md-button>

          <md-button class="md-icon-button md-accent">
            <md-icon>remove</md-icon>
          </md-button>
        </md-speed-dial-content>
      </md-speed-dial>
    </div>
  </div>
</template>

<script>
const axios = require('axios');

export default {

  name: 'Profile',
  data() {
    return {
      msg: 'This is Your Profile Page',
      username: null,
      email: null,
    };
  },
  created() {
    const token = this.$cookie.get('auth');
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
    this.fetchCurrentUser();
    this.fetchCategories();
  },

  methods: {
    fetchCurrentUser() {
      axios.post('/api', {
        query: '{me{username, email}}',
      })
        .then((res) => {
          this.username = res.data.data.me.username;
          this.email = res.data.data.me.email;
        });
    },

    fetchCategories() {
      axios.post('/api', {
        query: '{categories{id, name, description, isIncome}}',
      })
        .then((res) => {
          this.$store.commit('setCategories', res.data.data.categories);
        });
    },
  },
};
</script>

<style scoped>
  .md-button.md-theme-default.md-raised.add:not([disabled]) {
    background-color: #41c300;
  }

</style>
