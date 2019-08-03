<template>
  <v-layout row justify-center>
    <v-btn dark @click="dialog = true">Balance: {{ total }}</v-btn>

    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card>
            <v-toolbar dark color="#448aff">
              <v-toolbar-title>Transactions</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-toolbar-items>
                <v-btn icon @click="dialog = false">
                  <v-icon>close</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <div class="center">
              <v-list three-line subheader>
                <v-subheader>Transaction Details</v-subheader>
              </v-list>
            </div>
        <v-list two-line subheader>
          <v-subheader inset>Income</v-subheader>

          <div v-for="i in incomeCategoriesWithTransactions" :key="i._id">
            <v-list-tile avatar @click="i.expand = !i.expand">
              <v-list-tile-avatar>
                <v-icon>{{ i.name }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ i.description }}</v-list-tile-title>
                <v-list-tile-sub-title>amount will here</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>

            <v-expand-transition>
              <div v-show="i.expand">
                <v-btn flat>
                  <v-icon>star_border</v-icon>
                </v-btn>
                <v-btn flat>
                  <v-icon>settings</v-icon>
                </v-btn>
                <v-btn flat>
                  <v-icon>power</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </div>

          <v-divider inset></v-divider>

          <v-subheader inset>Spending</v-subheader>

          <div v-for="i in spendingCategoriesWithTransactions" :key="i._id">
            <v-list-tile avatar @click="i.expand = !i.expand">
              <v-list-tile-avatar>
                <v-icon>{{ i.name }}</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ i.description }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ i.expand }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon ripple>
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>

            <v-expand-transition>
              <div v-show="i.expand">
                <v-btn flat>
                  <v-icon>star_border</v-icon>
                </v-btn>
                <v-btn flat>
                  <v-icon>settings</v-icon>
                </v-btn>
                <v-btn flat>
                  <v-icon>power</v-icon>
                </v-btn>
              </div>
            </v-expand-transition>
          </div>

        </v-list>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  const moment = require('moment');

export default {
  name: 'TransactionsList',
  props: {
    total: {
      type: Number,
      required: true
    }
  },

  data() {
    return {
      dialog: false,
      // expand: false,
    };
  },


  computed: {
    incomeCategoriesWithTransactions() {
      return this.$store.getters.getIncomeCategoriesWithTransactions;
    },

    spendingCategoriesWithTransactions() {
      return this.$store.getters.getSpendingCategoriesWithTransactions;
    },

  },

  methods: {
    formatDate(timestamp) {
      return moment(parseInt(timestamp, 10)).format('DD/MM/YYYY');
    },
  },
};
</script>

<style scoped>

</style>
