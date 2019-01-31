const tools = require('graphql-tools');
const book = require('./book');
const user = require('./user');
const category = require('./category');

const schema = tools.mergeSchemas({
  schemas: [
    book,
    user,
    category,
  ],
});

module.exports = schema;
