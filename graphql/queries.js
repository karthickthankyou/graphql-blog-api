const { GraphQLList, GraphQLID } = require("graphql")
const { UserType, PostType, CommentType } = require("./types")
const { User, Comment, Post } = require("../models")

const users = {
  type: new GraphQLList(UserType),
  description: "Retrieves list of users",
  resolve(parent, args) {
    return User.find()
  },
}

const user = {
  type: UserType,
  description: "Retrieves one user",
  args: { id: { type: GraphQLID } },

  resolve(parent, args) {
    return User.findById(args.id)
  },
}

const posts = {
  type: new GraphQLList(PostType),
  description: "Retrieves list of posts",
  resolve() {
    return Post.find()
  },
}

const post = {
  type: PostType,
  description: "Retrieves one post",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return Post.findById(args.id)
  },
}
const comments = {
  type: new GraphQLList(CommentType),
  description: "Retrieves list of comments",
  resolve() {
    return Comment.find()
  },
}

const comment = {
  type: CommentType,
  description: "Retrieves one comment",
  args: { id: { type: GraphQLID } },
  resolve(_, args) {
    return Comment.findById(args.id)
  },
}

module.exports = { users, user, posts, post, comments, comment }
