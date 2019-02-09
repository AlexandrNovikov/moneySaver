<template>
  <v-container grid-list-xl class="">
    <v-layout row justify-space-around>
      <v-flex xs4 hidden-sm-and-down>
        <v-layout align-space-around justify-end row fill-height>
          <v-flex>
            <v-btn-toggle v-model="range">
              <v-btn flat value="day">
                Day
              </v-btn>
              <v-btn flat value="week" @click="weekHandler">
                Week
              </v-btn>
              <v-btn flat value="month">
                Month
              </v-btn>
              <v-btn flat value="all">
                All
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex class="arrow">
            <v-btn flat icon color="red lighten-2">
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex class="chart-container">
        <v-flex class="spacer" hidden-sm-and-down></v-flex>

        <dashboard-chart-spending
          :chartData="spendingChartData"
          ref="pieChart">
        </dashboard-chart-spending>
      </v-flex>

      <v-flex xs4 hidden-sm-and-down>
        <v-layout align-space-around justify-start row fill-height>

          <v-flex class="arrow">
            <v-btn flat icon color="red lighten-2">
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </v-flex>

          <v-flex>
            <v-menu
              v-model="pickerStart"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="slide-x-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="pickerStartDate"
                label="Start date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="pickerStartDate" @input="pickerStart = false" :type="pickerType"></v-date-picker>
            </v-menu>
          </v-flex>
          <v-flex>
            <v-menu
              v-model="pickerEnd"
              :close-on-content-click="false"
              :nudge-right="40"
              lazy
              transition="slide-x-reverse-transition"
              offset-y
              full-width
              min-width="290px"
            >
              <v-text-field
                slot="activator"
                v-model="pickerEndDate"
                label="End date"
                prepend-icon="event"
                readonly
              ></v-text-field>
              <v-date-picker v-model="pickerEndDate" @input="pickerEnd = false" :type="pickerType"></v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>
    <TransactionModal></TransactionModal>
    <TransactionForm v-if="isDetailsEnabled"></TransactionForm>
  </v-container>
</template>

<script>
import Anychart from 'anychart';
import TransactionModal from './TransactionModal';
import DashboardChartSpending from './DashboardChartSpending';
import TransactionForm from "./TransactionForm";

const axios = require('axios');
const moment = require('moment');

export default {
  name: 'Profile',
  components: {TransactionForm, TransactionModal, DashboardChartSpending },

  data() {
    return {
      username: null,
      email: null,
      pickerStart: false,
      pickerEnd: false,
      pickerStartDate: new Date().toISOString().substr(0, 10),
      pickerEndDate: new Date().toISOString().substr(0, 10),
      range: 'day',
      Anychart,
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
    spendingChartData() {
      const data = [];
      this.spendingCategoriesWithTransactions.forEach((category) => {
        const transactionsArr = category.transactions.map((transaction) => {
          return transaction.amount;
        });
        const transactionsTotal = transactionsArr.reduce((a, b) => a + b, 0);
        data.push([category.description, transactionsTotal]);
      });

      return data;
    },
    isDetailsEnabled() {
      return this.spendingCategoriesWithTransactions.length;
    },
    pickerType() {
      return (this.range === 'month') ? 'month': 'date'
    }
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

    weekHandler() {
      const today = moment();
      const from_date = today.startOf('isoWeek');
      this.pickerStartDate = from_date.toISOString().substr(0, 10);
      const to_date = today.endOf('isoWeek');
      this.pickerEndDate = to_date.toISOString().substr(0, 10);

    }
  },
};
</script>

<style scoped>
  .chart {
    width: 100%;
    height: 400px;
  }

  .chart-container .spacer {
    height: 40px;
  }

  @media only screen and (min-width: 1264px) {
    .chart-container {
      width: 480px;
    }
  }
  @media only screen and (min-width: 900px) {
    .chart-container {
      width: 480px;
    }
  }
  .arrow {
    margin: auto;
    width: 30px;
  }
</style>
