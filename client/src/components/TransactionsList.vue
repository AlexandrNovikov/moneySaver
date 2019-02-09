<template>
  <v-layout row justify-center>
    <v-btn dark @click="dialog = true">Details</v-btn>

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
        <!--<span>Income</span>-->
        <!--<div v-for="i in incomeCategoriesWithTransactions" :key="i._id">-->
        <!--<div v-for="y in i.transactions" :key="y._id">-->
        <!--<v-btn>{{i.description}}-->
        <!--<v-icon right dark>{{i.name}}</v-icon>-->
        <!--</v-btn>-->
        <!--<span>{{y.amount}}</span>-->
        <!--<span>{{y.description}}</span>-->
        <!--<span>{{formatDate(y.createdAt)}}</span>-->
        <!--</div>-->
        <!--</div>-->
        <!--<span>Spending</span>-->
        <!--<div v-for="i in spendingCategoriesWithTransactions" :key="i._id">-->
        <!--<v-btn>{{i.description}}-->
        <!--<v-icon right dark>{{i.name}}</v-icon>-->
        <!--</v-btn>-->
        <!--<div v-for="y in i.transactions" :key="y._id">-->
        <!--<span>{{y.amount}}</span>-->
        <!--<span>{{y.description}}</span>-->
        <!--<span>{{formatDate(y.createdAt)}}</span>-->
        <!--</div>-->
        <!--</div>-->
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

export default {
  name: 'TransactionsList',

  data() {
    return {
      dialog: false,
    };
  },


  computed: {
    incomeCategories() {
      return this.$store.state.incomeCategories;
    },
    spendingCategories() {
      return this.$store.state.spendingCategories;
    },
  },

  methods: {

  },
};
</script>

<style scoped>

</style>
