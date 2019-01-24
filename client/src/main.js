// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VueMaterial from 'vue-material';
import Vuetify from 'vuetify';
import VueCookie from 'vue-cookie';
import VueNoty from 'vuejs-noty';

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

const store = new Vuex.Store({
  state: {
    isAuthorized: VueCookie.get('auth') || false,
    categories: [],
  },
  mutations: {
    login(state, payload) {
      state.isAuthorized = payload;
    },
    logout(state) {
      state.isAuthorized = false;
    },
    setCategories(state, payload) {
      state.categories = payload;
    }
  },
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});
