<template>
  <v-layout row justify-center>
    <div class="bottom">
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
    </div>
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <form novalidate @submit.prevent="validateTransaction">
        <v-toolbar>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>New transaction</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon type="submit" @click="dialog = false">
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
                  <v-date-picker v-model="form.date" @input="picker = false"></v-date-picker>
                </v-menu>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="form.amount"
                  type="number"
                  label="Amount"
                  prepend-icon="money"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="form.description"
                  label="Description"
                  prepend-icon="note"
                ></v-text-field>
              </v-flex>
              <v-flex v-if="!form.isIncome"
                      class="categories"
                      v-for="i in spendingCategories" :key="i._id" sm4>
                <v-btn>{{i.description}}
                  <v-icon right dark>{{i.name}}</v-icon>
                </v-btn>
              </v-flex>
              <v-flex v-if="form.isIncome"
                      class="categories"
                      v-for="i in incomeCategories" :key="i._id" sm4>
                <v-btn>{{i.description}}
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
import { required } from 'vuelidate/lib/validators';

export default {
  name: 'TransactionModal',
  mixins: [validationMixin],

  data() {
    return {
      dialog: false,
      picker: false,
      categoriesMenu: false,
      form: {
        date: new Date().toISOString().substr(0, 10),
        amount: null,
        description: null,
        isIncome: false,
        categoryId: null,
      },
    };
  },

  validations: {
    form: {
      amount: {
        required,
      },
      categoryId: {
        required,
      },
    },
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
    incomeButtonHandler() {
      this.form.isIncome = true;
      this.dialog = true;
    },

    spendingButtonHandler() {
      this.form.isIncome = false;
      this.dialog = true;
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
    width: 140px;
  }

  .transaction-icons.left {
    margin-right: 40px;
  }

  .transaction-icons.right {
    margin-left: 40px;
  }

</style>
