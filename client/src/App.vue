<template>
  <div id="app">
    <the-drawer></the-drawer>
    <router-view/>
  </div>
</template>

<script>
import TheDrawer from './components/TheDrawer';

export default {
  name: 'App',
  components: { TheDrawer },
};
</script>

<style>
  .center {
    margin: auto;
    width: 50%;
    padding: 10px;
  }
</style>
