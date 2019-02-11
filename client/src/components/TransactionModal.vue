<template>
  <v-layout row justify-center>
    <v-flex class="bottom" hidden-sm-and-down>
      <v-btn fab dark large color="cyan"
             class="transaction-icons left"
             @click="incomeButtonHandler">
        <v-icon dark>add</v-icon>
      </v-btn>
      <v-btn fab dark large color="cyan"
             class="transaction-icons right"
             @click="spendingButtonHandler">
        <v-icon dark>remove</v-icon>
      </v-btn>
    </v-flex>
    <v-flex hidden-md-and-up>
      <v-bottom-nav value="true" absolute color="transparent">
        <v-btn color="teal" flat @click="incomeButtonHandler">
          <span>Income</span>
          <v-icon>add</v-icon>
        </v-btn>

        <v-btn color="teal" flat @click="spendingButtonHandler">
          <span>Spending</span>
          <v-icon>remove</v-icon>
        </v-btn>
      </v-bottom-nav>
    </v-flex>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <form novalidate @submit.prevent="validateTransaction">
          <v-toolbar>
            <v-btn icon @click="hideModal">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>{{title}}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon type="submit">
              <v-icon>done</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-menu
                    :close-on-content-click="false"
                    v-model="picker"
                    :nudge-right="40"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="form.date"
                      label="Date of transaction"
                      prepend-icon="event"
                      readonly
                    ></v-text-field>
                    <v-date-picker v-model="form.date"
                                   @input="picker = false"
                                   :max="currentDate">
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="form.amount"
                    type="number"
                    label="Amount"
                    prepend-icon="money"
                    required
                    :error-messages="amountErrors"
                    @input="$v.form.amount.$touch()"
                    @blur="$v.form.amount.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-text-field
                    v-model="form.description"
                    label="Description"
                    prepend-icon="note"
                  ></v-text-field>
                </v-flex>
                <hr v-if="isCategoryMissed" class="error--line">
                <span v-if="isCategoryMissed" class="error--text">Please choose a category</span>
                <v-flex v-if="!form.isIncome"
                        class="categories"
                        v-for="i in spendingCategories" :key="i._id" sm4>
                  <v-btn :class="{'primary':form.categoryId === i._id}"
                         @click="categoryButtonHandler(i._id)"
                  >{{i.description}}
                    <v-icon right dark>{{i.name}}</v-icon>
                  </v-btn>
                </v-flex>
                <v-flex v-if="form.isIncome"
                        class="categories"
                        v-for="i in incomeCategories" :key="i._id" sm4>
                  <v-btn :class="{'primary':form.categoryId === i._id}"
                         @click="categoryButtonHandler(i._id)"
                  >{{i.description}}
                    <v-icon right dark>{{i.name}}</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { validationMixin } from 'vuelidate';
const moment = require('moment');
import axios from 'axios';
import { required, minValue } from 'vuelidate/lib/validators';

export default {
  name: 'TransactionModal',
  mixins: [validationMixin],

  data() {
    return {
      dialog: false,
      picker: false,
      sending: false, //TODO use it for request progress
      currentDate: new Date().toISOString().substr(0, 10),
      form: {
        date: new Date().toISOString().substr(0, 10),
        amount: '',
        description: '',
        isIncome: false,
        categoryId: '',
      },
    };
  },

  validations: {
    form: {
      amount: { required, minValue: minValue(0.01) },
      categoryId: { required },
    },
  },

  watch: {
    dialog(val) {
      !val && this.clearForm();
    },
  },

  computed: {
    title() {
      return this.form.isIncome ? 'New income' : 'New spending';
    },
    incomeCategories() {
      return this.$store.state.incomeCategories;
    },
    spendingCategories() {
      return this.$store.state.spendingCategories;
    },
    amountErrors() {
      const errors = [];
      if (!this.$v.form.amount.$dirty) return errors;
      !this.$v.form.amount.required && errors.push('Please enter amount of your transaction');
      !this.$v.form.amount.minValue && errors.push('Amount of your transaction should be more than 0.01');
      return errors;
    },
    isCategoryMissed() {
      return this.$v.form.categoryId.$invalid && this.$v.form.categoryId.$dirty;
    },
    formattedDate() {
      return moment(this.form.date).unix();
    },
  },

  methods: {
    incomeButtonHandler() {
      this.form.isIncome = true;
      this.dialog = true;
    },

    spendingButtonHandler() {
      this.form.isIncome = false;
      this.dialog = true;
    },

    categoryButtonHandler(id) {
      this.form.categoryId = id;
    },

    validateTransaction() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.createTransaction();
      }
    },

    createTransaction() {
      this.sending = true;

      axios.post('/api', {
        query: `mutation{addTransaction(input: {categoryId: "${this.form.categoryId}", amount: ${this.form.amount}, description: "${this.form.description}", createdAt: "${this.formattedDate}"}){_id amount createdAt description}}`,
      })
        .then((res) => {
          if (res.data.errors) {
            this.$noty.error(res.data.errors[0].message);
          } else {
            const result = res.data.data.addTransaction;
            result.categoryId = this.form.categoryId;

            this.form.isIncome ? this.$store.commit('addIncomeTransaction', result) :
              this.$store.commit('addSpendingTransaction', result);

            this.hideModal();
          }
        }).catch((e) => { this.$noty.error(`${e.message}. Please reload page and try again`); })
        .finally(() => {
          this.sending = false;
          this.hideModal();
        });
    },

    hideModal() {
      this.dialog = false;
    },

    clearForm() {
      this.$v.$reset();
      this.form.amount = null;
      this.form.date = new Date().toISOString().substr(0, 10);
      this.form.description = '';
      this.form.categoryId = '';
    },
  },
};
</script>

<style scoped>

  .bottom {
    position: fixed;
    bottom: 30px;
  }

  .categories button {
    width: 100%;
  }

  .categories {
    width: 135px;
  }

  .transaction-icons.left {
    margin-right: 40px;
  }

  .transaction-icons.right {
    margin-left: 40px;
  }

  .error--line {
    width: 100%;
    border-color: #ff5252;
  }

</style>
