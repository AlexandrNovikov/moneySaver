const tools = require('graphql-tools');
const user = require('./user');
const category = require('./category');

const schema = tools.mergeSchemas({
  schemas: [
    user,
    category,
  ],
});

module.exports = schema;
