<template>
  <section class="section">
    <div class="container">
      <AuthorizePage v-if="!isAuthorized"></AuthorizePage>
      <Profile v-if="isAuthorized"></Profile>
    </div>
  </section>
</template>

<script>
import AuthorizePage from './AuthorizePage';
import Profile from './Profile';

export default {
  name: 'Hello',
  components: { Profile, AuthorizePage },
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
