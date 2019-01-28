'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/index');
const resolvers = require('./resolvers');
const jwt = require('express-jwt');
const axios = require('axios');
const { dbURL, secret } = require('./config');
const { errorType } = require('./services/constants');

// Constants
const PORT = 3000;

// App
const app = express();
app.use(bodyParser.json());

// authentication middleware
const authMiddleware = jwt({
  secret,
  credentialsRequired: false
});

const getErrorCode = errorName => {
  return errorType[errorName];
};

app.use(authMiddleware);

// app.use('/api', graphqlHTTP(req => ({
//   schema,
//   rootValue: resolvers,
//   graphiql: true,
//   context: {
//     user: req.user
//   }
// })));

app.use('/api', (req, res) => {
  graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
    context: {
      user: req.user
    },
    formatError: (err) => {
      const error = getErrorCode(err.message);
      if (error) {
        return ({ message: error.message, statusCode: error.statusCode })
      }
      return ({ message: err.message })
    }
  })(req, res)
});

app.get(`/api/users`, (req, res, next) => {
    return axios.get(`https://jsonplaceholder.typicode.com/users`)
      .then((response) => {
        res.json(response.data);
      });
});

app.get(`/api/users/:id`, (req, res, next) => {
  return axios.get(`https://jsonplaceholder.typicode.com/users/${req.params.id}`)
    .then((response) => {
      res.json(response.data);
    });
});

mongoose.connect(dbURL);
app.listen(PORT, () => {
    console.log(`App started and listening on port ${PORT}`)
});
