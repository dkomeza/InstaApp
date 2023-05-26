import mongoose from "mongoose";

export interface Tag {
  _id: string;
  name: string;
  popularity: number;
  posts: mongoose.Types.ObjectId[];
}

const tags = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  ],
  popularity: {
    type: Number,
    default: 0,
  },
});

export const TagModel = mongoose.model("Tag", tags);
