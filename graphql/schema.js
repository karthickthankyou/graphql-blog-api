// Import required stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require("graphql")

// Import queries
const { users, user, posts, post, comments, comment } = require("./queries")

// Import mutations
const { register, login, addPost, addComment } = require("./mutations")

// Define QueryType
const QueryType = new GraphQLObjectType({
  name: "QueryType",
  description: "Queries",
  fields: { users, user, posts, post, comments, comment },
})

// Define MutationType
const MutationType = new GraphQLObjectType({
  name: "MutationType",
  description: "Mutations",
  fields: { register, login, addPost, addComment },
})

module.exports = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
