<template>
  <div>
    <form novalidate class="md-layout" @submit.prevent="validateCategory">
      <md-toolbar class="md-toolbar md-primary" md-elevation="4">
        <div class="md-toolbar-section-start">
          <md-button @click="hideDrawer" class="md-icon-button">
            <md-icon>arrow_back</md-icon>
          </md-button>
        </div>
        <span class="md-title">{{isIncome ? 'Income' : 'Spending'}}</span>
        <div class="md-toolbar-section-end">
          <md-button v-if="currentName" @click="deleteCategory" class="md-icon-button">
            <md-icon>delete</md-icon>
          </md-button>
          <md-button v-if="isEdited" type="submit" class="md-icon-button">
            <md-icon>done</md-icon>
          </md-button>
        </div>
      </md-toolbar>
      <v-progress-linear v-if="sending"
                         :indeterminate="true"
                         background-color="blue lighten-3"
                         color="blue"
                         value="15">
      </v-progress-linear>

      <md-card>
        <md-card-content>
          <md-field :class="getValidationClass('description')">
            <md-icon v-if="form.name">{{form.name}}</md-icon>
            <label>Name</label>
            <md-input v-model="form.description"></md-input>

          </md-field>
          <md-divider></md-divider>
          <div class="icons" :class="getValidationClass('name')">
            <md-button v-for="category in categories"
                       :key="category.name"
                       class="md-icon-button md-raised"
                       :md-ripple="false"
                       :class="{'md-primary':form.name === category}"
                       @click="clickIconHandler(category)"
            >
              <md-icon>{{category}}</md-icon>
            </md-button>
          </div>
        </md-card-content>
      </md-card>
    </form>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate';
import axios from 'axios';
import { required } from 'vuelidate/lib/validators';
import { categories } from '../services/constants';

export default {
  /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
  name: 'TheDrawerCategory',
  mixins: [validationMixin],

  props: {
    _id: {
      type: String,
      required: false,
      default: '',
    },
    currentName: {
      type: String,
      required: false,
      default: '',
    },
    currentDesc: {
      type: String,
      required: false,
      default: '',
    },
    isIncome: {
      type: Boolean,
      required: true,
    },
  },

  validations: {
    form: {
      name: {
        required,
      },
      description: {
        required,
      },
    },
  },

  data() {
    return {
      sidePanelVisible: false,
      secondPanel: false,
      sending: false,
      form: {
        name: this.currentName,
        description: this.currentDesc,
      },
    };
  },

  computed: {
    categories() {
      return categories;
    },
    isEdited() {
      return this.form.name !== this.currentName ||
        this.form.description !== this.currentDesc;
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }
      return '';
    },

    clickIconHandler(name) {
      this.form.name = name;
    },

    saveCategory() {
      this.sending = true;

      axios.post('/api', {
        query: `mutation{addCategory(name: "${this.form.name}", description: "${this.form.description}", isIncome: ${this.isIncome}) {_id name description isIncome}}`,
      })
        .then((res) => {
          if (res.data.errors) {
            this.$noty.error(res.data.errors[0].message);
          } else {
            this.$store.commit('addCategory', res.data.data.addCategory);
            this.hideDrawer();
          }
        }).catch((e) => { this.$noty.error(`${e.message}. Please reload page and try again`); })
        .finally(() => { this.sending = false; });
    },

    updateCategory() {
      this.sending = true;

      axios.post('/api', {
        query: `mutation{updateCategory(_id: "${this._id}" name: "${this.form.name}", description: "${this.form.description}") {_id name description isIncome}}`,
      })
        .then((res) => {
          if (res.data.errors) {
            this.$noty.error(res.data.errors[0].message);
          } else {
            this.$store.commit('updateCategory', res.data.data.updateCategory);
            this.hideDrawer();
          }
          this.sending = false;
        });
    },


    deleteCategory() {
      this.sending = true;

      axios.post('/api', {
        query: `mutation{removeCategory(_id: "${this._id}") {_id, isIncome}}`,
      })
        .then((res) => {
          if (res.data.errors) {
            this.$noty.error(res.data.errors[0].message);
          } else {
            this.$store.commit('removeCategory', res.data.data.removeCategory);
            this.hideDrawer();
          }
          this.sending = false;
        });
    },

    validateCategory() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        /* eslint-disable no-unused-expressions */
        this._id ? this.updateCategory() : this.saveCategory();
      }
    },

    hideDrawer() {
      this.$emit('hide');
    },
  },
};
</script>

<style lang="scss" scoped>

  .icons {
    display: flex;
    flex-wrap: wrap;
  }

  .icons .md-icon-button {
    margin: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .icons.md-invalid {
    border-style: double;
    border-color: red;
  }

  .v-progress-linear {
    margin: unset;
  }
</style>
