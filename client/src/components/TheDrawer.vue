<template>
  <div class="page-container md-layout-column">
    <md-toolbar class="md-primary">
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

    <md-drawer class="md-right" :md-active.sync="sidePanelVisible">
      <md-toolbar class="md-toolbar md-primary" md-elevation="4">
        <span class="md-title">Categories</span>
        <div class="md-toolbar-section-end">
        <md-button @click="clickCategoryHandler()" class="md-icon-button">
          <md-icon>add</md-icon>
        </md-button>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item
          v-for="category in categories"
          :key="category.id"
          @click="clickCategoryHandler(category.name, category.description)"
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
        :currentName="categoryName"
        :currentDesc="categoryDesc"
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
      sidePanelVisible: false,
      secondPanel: false,
      categoryName: null,
      categoryDesc: null,
    };
  },

  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
    categories() {
      return this.$store.state.categories;
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

    clickCategoryHandler(name = '', description = '') {
      this.categoryName = name;
      this.categoryDesc = description;
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
    width: 330px;
    max-width: calc(100vw - 125px);
  }
</style>
