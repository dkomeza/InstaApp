import mongoose from "mongoose";

const comments = new mongoose.Schema({
  author: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  lastChangeTime: {
    type: Date,
    default: Date.now,
  },
  history: [
    {
      text: String,
      time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

export const CommentModel = mongoose.model("Comment", comments);
