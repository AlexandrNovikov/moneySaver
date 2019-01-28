const { makeExecutableSchema } = require('graphql-tools');


const typeDefs = `
    type Category {
      id: String!
      userId: String!
      name: String!
      description: String!
      isIncome: Boolean!
    }
  
    type Query {
      categories: [Category]
    }
  
    type Mutation {
      addCategory(name: String!, description: String!, isIncome: Boolean!): Category!
      removeCategory(id: String!): Category!
      updateCategory(id: String!, name: String, description: String): Category!
    }
`;

module.exports = makeExecutableSchema({ typeDefs });
