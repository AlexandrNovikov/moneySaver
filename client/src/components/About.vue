<template>
  <section class="section">
    <div class="container">
      <h1>{{ msg }}</h1>
    </div>
    <table>
      <thead>
      <tr>
        <th>Title</th>
        <th>Author</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="book in books"
          :key="book.title">
        <td>{{ book.title }}</td>
        <td>{{ book.author }}</td>
      </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
const axios = require('axios');

export default {

  name: 'About',
  data() {
    return {
      msg: 'This is Your About Page',
      books: [],
    };
  },
  created() {
    const token = this.$cookie.get('auth');
    if (token) {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      this.fetchBooks();
    } else {
      this.$router.push('/authorize');
      this.$noty.info('Please, authorize before viewing this page');
    }
  },
  methods: {
    fetchBooks() {
      axios.post('/api', {
        query: '{books{title, author}}',
      })
        .then((res) => {
          this.books = res.data.data.books;
        });
    },
  },
};
</script>

<style scoped>

</style>
