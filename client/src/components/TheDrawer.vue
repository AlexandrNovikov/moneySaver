<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-primary">
        <md-button class=" md-icon-button" v-if="isAuthorized" v-on:click="leftDrawer = true">
          <md-icon>date_range</md-icon>
        </md-button>
      <h3 class="md-title" style="flex: 1">Budget Planner</h3>

      <div class="md-toolbar-section-end">
        <md-button v-if="isAuthorized" v-on:click="logout" class="md-icon-button">
          <md-icon>exit_to_app</md-icon>
        </md-button>
        <md-button v-if="isAuthorized" v-on:click="showSidePanel" class="md-icon-button">
          <md-icon>menu</md-icon>
        </md-button>
      </div>
    </md-toolbar>

    <md-drawer class="md-left" :md-active.sync="leftDrawer"></md-drawer>

    <md-drawer class="md-right" :md-active.sync="sidePanelVisible">
      <md-toolbar class="md-toolbar md-primary" md-elevation="4">
        <span class="md-title">Categories</span>
      </md-toolbar>
      <md-subheader class="md-primary">
        <span class="md-subheading">Spending</span>
        <div class="md-toolbar-section-end">
          <md-button @click="clickCategoryHandler(false)" class="md-icon-button">
            <md-icon>add</md-icon>
          </md-button>
        </div>
      </md-subheader>
      <md-divider></md-divider>
      <md-list>
        <md-list-item
          v-for="category in spendingCategories"
          :key="category.id"
          @click="clickCategoryHandler(false, category._id, category.name, category.description)"
        >
          <span class="md-list-item-text">{{category.description}}</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">{{category.name}}</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
      <md-divider></md-divider>
      <md-subheader class="md-primary">
        <span class="md-subheading">Income</span>
        <div class="md-toolbar-section-end">
          <md-button @click="clickCategoryHandler(true)" class="md-icon-button">
            <md-icon>add</md-icon>
          </md-button>
        </div>
      </md-subheader>
      <md-divider></md-divider>
      <md-list>
        <md-list-item
          v-for="category in incomeCategories"
          :key="category.id"
          @click="clickCategoryHandler(true, category._id, category.name, category.description)"
        >
          <span class="md-list-item-text">{{category.description}}</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">{{category.name}}</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </md-drawer>
    <md-drawer class="md-right category" :md-active.sync="secondPanel">
      <TheDrawerCategory
        v-if="secondPanel"
        :_id="categoryId"
        :currentName="categoryName"
        :currentDesc="categoryDesc"
        :isIncome = "categoryIsIncome"
        @hide="hideCategoryPanel">
      </TheDrawerCategory>
    </md-drawer>
  </div>
</template>

<script>

import TheDrawerCategory from './TheDrawerCategory';

export default {
  name: 'TheDrawer',
  components: { TheDrawerCategory },

  data() {
    return {
      leftDrawer: false,
      sidePanelVisible: false,
      secondPanel: false,
      categoryId: null,
      categoryName: null,
      categoryDesc: null,
      categoryIsIncome: null,
    };
  },

  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    incomeCategories() {
      return this.$store.state.incomeCategories;
    },
    spendingCategories() {
      return this.$store.state.spendingCategories;
    },
  },
  methods: {
    logout() {
      this.$cookie.delete('auth');
      this.$store.commit('logout');
    },

    showSidePanel() {
      this.sidePanelVisible = true;
    },

    hideCategoryPanel() {
      this.secondPanel = false;
    },

    clickCategoryHandler(isIncome, _id = '', name = '', description = '') {
      this.categoryId = _id;
      this.categoryName = name;
      this.categoryDesc = description;
      this.categoryIsIncome = isIncome;
      this.secondPanel = true;
    },
  },
};
</script>

<style lang="scss" scoped>

  .md-layout-item {
    height: 40px;
    margin-top: 8px;
    margin-bottom: 8px;

    span {
      width: 100%;
      height: 100%;
      padding: 8px;
      display: block;
      background: md-get-palette-color(teal, 200);
    }
  }

  .header {
    margin-bottom: 10px;
  }

  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-drawer.category {
    width: 300px;
    max-width: calc(100vw - 125px);
  }
</style>
