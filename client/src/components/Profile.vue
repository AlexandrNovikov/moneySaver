<template>
  <v-container grid-list-xl>
    <v-layout align-space-around v-bind="binding">
      <v-flex xs4>
        <v-layout align-space-around justify-center row fill-height>
          <v-flex>
            <v-btn-toggle v-model="range">
              <v-btn flat value="day" @click="rangeHandler('day')">
                Day
              </v-btn>
              <v-btn flat value="week" @click="rangeHandler('week')">
                Week
              </v-btn>
              <v-btn flat value="month" @click="rangeHandler('month')">
                Month
              </v-btn>
              <v-btn flat value="year" @click="rangeHandler('year')">
                Year
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex hidden-md-and-up>
            <v-btn-toggle v-model="range">
            <v-btn flat value="custom"> <!--TODO-->
              Custom
            </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex class="arrow" hidden-sm-and-down>
            <v-btn flat icon color="red lighten-2" @click="previousHandler">
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex class="chart-container" v-touch="{
      left: () => nextHandler(),
      right: () => previousHandler(),
    }">
      <v-flex class="spacer" hidden-sm-and-down></v-flex>

        <dashboard-chart-spending
          :chartData="spendingChartData"
          :title="chartTitle"
          :income-total="incomeTotal"
          ref="pieChart">
        </dashboard-chart-spending>
      </v-flex>

      <v-flex xs4 hidden-sm-and-down>
        <v-layout align-space-around justify-start row fill-height>

          <v-flex class="arrow">
            <v-btn flat icon color="red lighten-2" @click="nextHandler">
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
              <v-date-picker v-model="pickerStartDate"
                             @input="pickerStart = false"
                             type="date">
              </v-date-picker>
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
              <v-date-picker v-model="pickerEndDate"
                             @input="pickerEnd = false"
                             type="date">
              </v-date-picker>
            </v-menu>
          </v-flex>
        </v-layout>
      </v-flex>

    </v-layout>
    <TransactionModal></TransactionModal>
    <TransactionsList v-if="isDetailsEnabled" :total="balance"></TransactionsList>
  </v-container>
</template>

<script>
import Anychart from 'anychart';
import TransactionModal from './TransactionModal';
import DashboardChartSpending from './DashboardChartSpending';
import TransactionsList from './TransactionsList';

const axios = require('axios');
const moment = require('moment');

export default {
  name: 'Profile',
  components: { TransactionsList, TransactionModal, DashboardChartSpending },

  data() {
    return {
      username: null,
      email: null,
      pickerStart: false,
      pickerEnd: false,
      pickerStartDate: moment().format('YYYY-MM-DD'),
      pickerEndDate: moment().format('YYYY-MM-DD'),
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
      const start = moment(this.pickerStartDate).unix();
      const end = moment(this.pickerEndDate).unix();

      this.spendingCategoriesWithTransactions.forEach((category) => {
        let transactionsArr = category.transactions
          .filter(transaction => parseInt(transaction.createdAt, 10) >= start &&
          parseInt(transaction.createdAt, 10) <= end);
        if (transactionsArr.length) {
          transactionsArr = transactionsArr.map(transaction => transaction.amount);
          const transactionsTotal = transactionsArr.reduce((a, b) => a + b, 0);
          data.push([category.description, transactionsTotal]);
        }
      });

      return data;
    },
    incomeTotal() {
      const data = [];
      const start = moment(this.pickerStartDate).unix();
      const end = moment(this.pickerEndDate).unix();

      this.incomeCategoriesWithTransactions.forEach((category) => {
        let transactionsArr = category.transactions
          .filter(transaction => parseInt(transaction.createdAt, 10) >= start &&
            parseInt(transaction.createdAt, 10) <= end);
        if (transactionsArr.length) {
          transactionsArr = transactionsArr.map(transaction => transaction.amount);
          const transactionsTotal = transactionsArr.reduce((a, b) => a + b, 0);
          data.push(transactionsTotal);
        }
      });

      return data.reduce((a, b) => a + b, 0);
    },
    isDetailsEnabled() {
      return this.spendingCategoriesWithTransactions.length;
    },
    binding() {
      const binding = {};

      if (this.$vuetify.breakpoint.mdAndUp) {
        binding.row = true;
      } else {
        binding.column = true;
      }

      return binding;
    },
    chartTitle() {
      return this.$vuetify.breakpoint.smAndDown ? `${this.pickerStartDate} - ${this.pickerEndDate}` : null;
    },
    incomeTotalBalance() {
      const data = [];
      const end = moment(this.pickerEndDate).unix();

      this.incomeCategoriesWithTransactions.forEach((category) => {
        let transactionsArr = category.transactions
          .filter(transaction => parseInt(transaction.createdAt, 10) <= end);
        if (transactionsArr.length) {
          transactionsArr = transactionsArr.map(transaction => transaction.amount);
          const transactionsTotal = transactionsArr.reduce((a, b) => a + b, 0);
          data.push(transactionsTotal);
        }
      });

      return data.reduce((a, b) => a + b, 0);
    },
    spendingTotalBalance() {
      const data = [];
      const end = moment(this.pickerEndDate).unix();

      this.spendingCategoriesWithTransactions.forEach((category) => {
        let transactionsArr = category.transactions
          .filter(transaction => parseInt(transaction.createdAt, 10) <= end);
        if (transactionsArr.length) {
          transactionsArr = transactionsArr.map(transaction => transaction.amount);
          const transactionsTotal = transactionsArr.reduce((a, b) => a + b, 0);
          data.push(transactionsTotal);
        }
      });

      return data.reduce((a, b) => a + b, 0);
    },

    balance() {
      return this.incomeTotalBalance - this.spendingTotalBalance;
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

    rangeHandler(range) {
      if (range === 'day') {
        this.pickerStartDate = moment().format('YYYY-MM-DD');
        this.pickerEndDate = moment().format('YYYY-MM-DD');
      } else {
        this.pickerStartDate = moment().startOf(range).format('YYYY-MM-DD');
        this.pickerEndDate = moment().endOf(range).format('YYYY-MM-DD');
      }
    },

    previousHandler() { // TODO merge two methods to one which returns object
      this.pickerStartDate = moment(this.pickerStartDate).subtract(1, this.range).startOf(this.range).format('YYYY-MM-DD');
      this.pickerEndDate = moment(this.pickerEndDate).subtract(1, this.range).endOf(this.range).format('YYYY-MM-DD');
    },

    nextHandler() {
      this.pickerStartDate = moment(this.pickerStartDate).add(1, this.range).startOf(this.range).format('YYYY-MM-DD');
      this.pickerEndDate = moment(this.pickerEndDate).add(1, this.range).endOf(this.range).format('YYYY-MM-DD');
    },
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
