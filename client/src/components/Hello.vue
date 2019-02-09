<template>
  <section>
    <TheDrawer></TheDrawer>
    <v-container>
      <AuthorizePage v-if="!isAuthorized"></AuthorizePage>
      <Profile v-if="isAuthorized"></Profile>
    </v-container>
  </section>
</template>

<script>
import AuthorizePage from './AuthorizePage';
import Profile from './Profile';
import TheDrawer from './TheDrawer';

export default {
  name: 'Hello',
  components: { TheDrawer, Profile, AuthorizePage },
  data() {
    return {

    };
  },
  computed: {
    isAuthorized() {
      return this.$store.state.isAuthorized;
    },
  },
};
</script>

<style scoped>

</style>
