import mongoose from "mongoose";

const posts = new mongoose.Schema({
  images: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Image",
      required: true,
    },
  ],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  lastChangeTime: {
    type: Date,
    default: Date.now,
  },
  lastChangeOperation: {
    type: String,
    default: "create",
    required: true,
  },
  history: [
    {
      desc: String,
      time: {
        type: Date,
        default: Date.now,
      },
      operation: String,
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  ],
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
      required: true,
    },
  ],
});

export const PostModel = mongoose.model("Post", posts);
