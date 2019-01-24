const authSrv = {

  generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
  },

  isEmailValid(email) {
    const regexp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regexp.test(email);
  }

};

module.exports = authSrv;

