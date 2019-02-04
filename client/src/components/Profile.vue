<template>
  <div>
    <div class="center">
      <div>{{this.msg}}</div>
      <div>User data:</div>
      <p>Username: {{this.username}}</p>
      <p>Email: {{this.email}}</p>
      <span>Income</span>
      <div v-for="i in incomeCategoriesWithTransactions" :key="i._id">
        <div v-for="y in i.transactions" :key="y._id">
          <v-btn>{{i.description}}
            <v-icon right dark>{{i.name}}</v-icon>
          </v-btn>
          <span>{{y.amount}}</span>
          <span>{{y.description}}</span>
          <span>{{formatDate(y.createdAt)}}</span>
        </div>
      </div>
      <span>Spendins</span>
      <div v-for="i in spendingCategoriesWithTransactions" :key="i._id">
        <v-btn>{{i.description}}
          <v-icon right dark>{{i.name}}</v-icon>
        </v-btn>
        <div v-for="y in i.transactions" :key="y._id">
          <span>{{y.amount}}</span>
          <span>{{y.description}}</span>
          <span>{{formatDate(y.createdAt)}}</span>
        </div>
      </div>
      <TransactionModal></TransactionModal>
    </div>
  </div>
</template>

<script>
import TransactionModal from './TransactionModal';

const axios = require('axios');
const moment = require('moment');

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

  computed: {
    incomeCategories() {
      return this.$store.state.incomeCategories;
    },
    spendingCategories() {
      return this.$store.state.spendingCategories;
    },
    incomeCategoriesWithTransactions() {
      return _.filter(this.incomeCategories, n => n.transactions.length);
    },
    spendingCategoriesWithTransactions() {
      return _.filter(this.spendingCategories, n => n.transactions.length);
    },
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
        query: '{categories{_id, name, description, isIncome, transactions{_id, description, createdAt, amount}}}',
      })
        .then((res) => {
          this.$store.commit('setCategories', res.data.data.categories);
        });
    },

    formatDate(timestamp) {
      return moment(parseInt(timestamp, 10)).format('DD/MM/YYYY');
    },
  },
};
</script>

<style scoped>

</style>
