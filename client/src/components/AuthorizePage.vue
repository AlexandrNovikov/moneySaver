<template>
  <div>
    <md-tabs md-alignment="centered">
      <md-tab id="tab-login" md-label="Login">
        <AuthorizePageLoginForm></AuthorizePageLoginForm>
      </md-tab>
      <md-tab id="tab-signup" md-label="Sign Up">
        <AuthorizePageSignupForm></AuthorizePageSignupForm>
      </md-tab>
    </md-tabs>
  </div>
</template>

<script>
import AuthorizePageSignupForm from './AuthorizePageSignupForm';
import AuthorizePageLoginForm from './AuthorizePageLoginForm';

export default {
  name: 'AuthorizePage',
  components: { AuthorizePageLoginForm, AuthorizePageSignupForm },
};
</script>

<style scoped>

</style>

