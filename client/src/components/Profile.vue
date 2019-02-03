<template>
  <div>
    <div class="center">
      <div>{{this.msg}}</div>
      <div>User data:</div>
      <p>Username: {{this.username}}</p>
      <p>Email: {{this.email}}</p>
      <TransactionModal></TransactionModal>
    </div>
  </div>
</template>

<script>
import TransactionModal from './TransactionModal';

const axios = require('axios');

export default {
  name: 'Profile',
  components: { TransactionModal },
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
        query: '{categories{_id, name, description, isIncome}}',
      })
        .then((res) => {
          this.$store.commit('setCategories', res.data.data.categories);
        });
    },
  },
};
</script>

<style scoped>

</style>
