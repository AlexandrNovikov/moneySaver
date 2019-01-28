const { makeExecutableSchema } = require('graphql-tools');


const typeDefs = `
    type Category {
      id: String!
      userId: String!
      name: String!
      description: String!
    }
  
    type Query {
      categories: [Category]
    }
  
    type Mutation {
      addCategory(name: String!, description: String!): Category!
      removeCategory(id: String!): Category!
      updateCategory(id: String!, name: String, description: String): Category
    }
`;

module.exports = makeExecutableSchema({ typeDefs });
