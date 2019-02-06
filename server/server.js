'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/index');
const resolvers = require('./resolvers');
const jwt = require('express-jwt');
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

mongoose.connect(dbURL);
app.listen(PORT, () => {
    console.log(`App started and listening on port ${PORT}`)
});
