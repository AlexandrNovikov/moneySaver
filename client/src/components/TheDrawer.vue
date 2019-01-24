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
      <md-toolbar class="md-transparent" md-elevation="0">
        <span class="md-title">Categories</span>
        <div class="md-toolbar-section-end">
        <md-button class="md-icon-button md-raised">
          <md-icon>add</md-icon>
        </md-button>
        </div>
      </md-toolbar>

      <md-list>
        <md-list-item>
          <span class="md-list-item-text">Abbey Christansen</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Alex Nelson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon class="md-primary">chat_bubble</md-icon>
          </md-button>
        </md-list-item>

        <md-list-item>
          <span class="md-list-item-text">Mary Johnson</span>

          <md-button class="md-icon-button md-list-action">
            <md-icon>chat_bubble</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </md-drawer>
  </div>
</template>

<script>
const axios = require('axios');

export default {
  name: 'TheDrawer',

  data: () => ({
    sidePanelVisible: false,
    categories: [],
  }),

  // beforeUpdate() {
  //   if(this.isAuthorized) {
  //     const token = this.$cookie.get('auth');
  //
  //     axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  //     this.fetchCategories();
  //   }
  // },

  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
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
</style>
