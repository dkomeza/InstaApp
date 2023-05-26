import mongoose from "mongoose";
import { IUser } from "./UserModel.js";

export interface IComment {
  _id: string;
  author: IUser;
  text: string;
  lastChangeTime: Date;
  history: {
    text: string;
    time: Date;
  }[];
  likes: IUser[];
}

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
