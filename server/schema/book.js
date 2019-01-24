const { makeExecutableSchema } = require('graphql-tools');


const typeDefs = `
    type Book {
      title: String!
      author: String!
    }
  
    type Query {
      books: [Book]
    }
  
    type Mutation {
      addBook(title: String!, author: String!): Book!
      removeBook(title: String!): Book!
    }
`;

module.exports = makeExecutableSchema({ typeDefs });
