const { makeExecutableSchema } = require('graphql-tools');


const typeDefs = `
    type Category {
      id: ID!
      userId: String!
      name: String!
      description: String!
      isIncome: Boolean!
      transactions: [Transaction]
    }
    
    type Transaction {
      id: ID!
      amount: Float!
      description: String
      createdAt: String
    }
    
    input updateTransactionInput {
      id: ID!
      amount: Float
      description: String
      createdAt: String
    }
  
    type Query {
      categories(id: String, isIncome: Boolean): [Category]
    }
  
    type Mutation {
      addCategory(name: String!, description: String!, isIncome: Boolean!): Category!
      removeCategory(id: String!): Category!
      updateCategory(id: String!, name: String, description: String): Category!
      addTransaction(categoryId: String!, amount: Float!, description: String): Transaction!
      removeTransaction(id: String!): Transaction!
      updateTransaction(input: updateTransactionInput!): Transaction!
    }
`;

module.exports = makeExecutableSchema({ typeDefs });
