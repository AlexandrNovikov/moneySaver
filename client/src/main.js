import Vue from 'vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material';
import Vuetify from 'vuetify';
import VueCookie from 'vue-cookie';
import VueNoty from 'vuejs-noty';
import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';

import 'vue-material/dist/vue-material.min.css';
import 'vuetify/dist/vuetify.min.css';
import 'vuejs-noty/dist/vuejs-noty.css';

import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.use(VueNoty, {
  timeout: 4000,
  progressBar: true,
  layout: 'topCenter',
});
Vue.use(Vuex);
Vue.use(VueMaterial);
Vue.use(Vuetify);
Vue.use(VueCookie);
Vue.use(moment);
Object.defineProperty(Vue.prototype, '$_', { value: _ });

const store = new Vuex.Store({
  state: {
    isAuthorized: VueCookie.get('auth') || false,
    incomeCategories: [], //TODO Think about simplifying logic of vuex. store only categories and get different of them via getters
    spendingCategories: [],
  },
  /* eslint-disable no-unused-expressions */
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  getters: { //TODO implement getters for getting all types of categories here and in component level
    getIncomeCategoriesWithTransactions: state => {
      return state.incomeCategories.filter(n => n.transactions.length);
    },
    getSpendingCategoriesWithTransactions: state => {
      return state.spendingCategories.filter(n => n.transactions.length);
    },
  },
  mutations: {
    login(state, payload) {
      state.isAuthorized = payload;
    },
    logout(state) {
      state.isAuthorized = false;
    },
    setCategories(state, payload) {
      state.incomeCategories = _.filter(payload, n => n.isIncome);
      state.spendingCategories = _.filter(payload, n => !n.isIncome);
    },
    addCategory(state, payload) {
      payload.isIncome ? state.incomeCategories.push(payload) :
        state.spendingCategories.push(payload);
    },
    removeCategory(state, payload) {
      payload.isIncome ? _.remove(state.incomeCategories, n => n._id === payload._id) :
        _.remove(state.spendingCategories, n => n._id === payload._id);
    },
    updateCategory(state, payload) {
      const updated = payload.isIncome ?
        _.find(state.incomeCategories, n => n._id === payload._id) :
        _.find(state.spendingCategories, n => n._id === payload._id);

      updated.name = payload.name;
      updated.description = payload.description;
    },
    addIncomeTransaction(state, payload) {
      const category = _.find(state.incomeCategories, n => n._id === payload.categoryId);
      category.transactions.push(payload);
    },
    addSpendingTransaction(state, payload) {
      const category = _.find(state.spendingCategories, n => n._id === payload.categoryId);
      category.transactions.push(payload);
    },
  },
});

if (store.state.isAuthorized) {
  axios.defaults.headers.common.Authorization = `Bearer ${store.state.isAuthorized}`;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
