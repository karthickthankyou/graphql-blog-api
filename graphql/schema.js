// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql")

// Import queries
const {} = require("./queries")

// Import mutations
const {} = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: {},
})

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: {},
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
