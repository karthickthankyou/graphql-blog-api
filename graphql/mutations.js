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

const updatePost = {
  type: PostType,
  description: "Update blog post",
  args: {
    id: { type: GraphQLString },
    title: { type: GraphQLString },
    body: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const postUpdated = await Post.findOneAndUpdate(
      {
        _id: args.id,
        authorId: verifiedUser._id,
      },
      { title: args.title, body: args.body },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!postUpdated) {
      throw new Error("No post with the given ID found for the author")
    }

    return postUpdated
  },
}

const deletePost = {
  type: GraphQLString,
  description: "Delete post",
  args: {
    postId: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log(verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const postDeleted = await Post.findOneAndDelete({
      _id: args.postId,
      authorId: verifiedUser._id,
    })
    if (!postDeleted) {
      throw new Error("No post with the given ID found for the author")
    }

    return "Post deleted"
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

const updateComment = {
  type: CommentType,
  description: "Update blog comment",
  args: {
    id: { type: GraphQLString },
    comment: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const commentUpdated = await Comment.findOneAndUpdate(
      {
        _id: args.id,
        userId: verifiedUser._id,
      },
      { comment: args.comment },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!commentUpdated) {
      throw new Error("No comment with the given ID found for the author")
    }

    return commentUpdated
  },
}

const deleteComment = {
  type: GraphQLString,
  description: "Delete comment",
  args: {
    commentId: { type: GraphQLString },
  },
  async resolve(parent, args, { verifiedUser }) {
    console.log(verifiedUser)
    if (!verifiedUser) {
      throw new Error("Unauthenticated")
    }
    const commentDeleted = await Comment.findOneAndDelete({
      _id: args.commentId,
      userId: verifiedUser._id,
    })
    if (!commentDeleted) {
      throw new Error("No post with the given ID found for the author")
    }

    return "Post deleted"
  },
}

module.exports = {
  register,
  login,
  addPost,
  addComment,
  updatePost,
  deletePost,
  updateComment,
  deleteComment,
}
