// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql")

// Import queries
const { users } = require("./queries")

// Import mutations
const { register, login } = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: { users },
})

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: { register, login },
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
