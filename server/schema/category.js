const { makeExecutableSchema } = require('graphql-tools');


const typeDefs = `
    type Category {
      _id: ID!
      _userId: ID!
      name: String!
      description: String!
      isIncome: Boolean!
      transactions: [Transaction]
    }
    
    type Transaction {
      _id: ID!
      amount: Float!
      description: String
      createdAt: String
    }
    
    input updateTransactionInput {
      _id: ID!
      amount: Float
      description: String
      createdAt: String
    }
  
    type Query {
      category(_id: ID!): [Category]
      categories(isIncome: Boolean): [Category]
    }
  
    type Mutation {
      addCategory(name: String!, description: String!, isIncome: Boolean!): Category!
      removeCategory(_id: ID!): Category!
      updateCategory(_id: ID!, name: String, description: String): Category!
      addTransaction(categoryId: ID!, amount: Float!, description: String): Transaction!
      removeTransaction(_id: ID!): Transaction!
      updateTransaction(input: updateTransactionInput!): Transaction!
    }
`;

module.exports = makeExecutableSchema({ typeDefs });
