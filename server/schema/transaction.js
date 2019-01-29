const { makeExecutableSchema } = require('graphql-tools');


const typeDefs = `
    type Transaction {
      id: String!
      userId: String!
      categoryId: String!
      amount: Float!
      description: String
      dateTime: String
      isIncome: Boolean!
    }
  
    type Query {
      transactions(categoryId: String, isIncome: Boolean): [Transaction]
    }
  
    type Mutation {
      addTransaction(categoryId: String!, amount: Float!, description: String, isIncome: Boolean!): Transaction!
    }
`;

module.exports = makeExecutableSchema({ typeDefs });
