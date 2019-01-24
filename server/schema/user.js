const { makeExecutableSchema } = require('graphql-tools');

const typeDefs = `
      type User {
        id: String!
        username: String!
        email: String!
      }

      type Query {
        me: User
      }

      type Mutation {
        signup (username: String!, email: String!, password: String!): String
        login (email: String!, password: String!): String
      }
`;

module.exports = makeExecutableSchema({ typeDefs });
