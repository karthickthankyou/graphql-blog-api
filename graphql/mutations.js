const { PostType, CommentType } = require("./types")

const { User, Post, Comment } = require("../models")
const { GraphQLString } = require("graphql")

const { createJwtToken } = require("../util/auth")

const register = {
  type: GraphQLString,
  description: "Register new user",
  args: {
    username: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    displayName: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const { username, email, password, displayName } = args
    const user = new User({ username, email, password, displayName })

    await user.save()
    const token = createJwtToken(user)
    return token
  },
}

const login = {
  type: GraphQLString,
  description: "Login user",
  args: {
    email: { type: GraphQLString },
    password: { type: GraphQLString },
  },
  async resolve(parent, args) {
    const user = await User.findOne({ email: args.email }).select("+password")
    console.log(user)
    if (!user || args.password !== user.password) {
      throw new Error("Invalid credentials")
    }

    const token = createJwtToken(user)
    return token
  },
}

const addPost = {
  type: PostType,
  description: "Create new blog post",
  args: {
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    console.log("Verified User: ", verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthorized")
    }

    const post = new Post({
      authorId: verifiedUser._id,
      title: args.title,
      body: args.body,
    })

    return post.save()
  },
}

const addComment = {
  type: CommentType,
  description: "Create a new comment on the blog post",
  args: {
    comment: { type: GraphQLString },
    postId: { type: GraphQLString },
  },
  resolve(parent, args, { verifiedUser }) {
    const comment = new Comment({
      userId: verifiedUser._id,
      postId: args.postId,
      comment: args.comment,
    })
    return comment.save()
  },
}

module.exports = { register, login, addPost, addComment }
