import mongoose from "mongoose";

export interface Image {
  _id: string;
  album: string;
  originalName: string;
  path: string;
  lastChangeTime: Date;
  lastChangeOperation: string;
  history: {
    desc: string;
    operation: string;
    path: string;
  }[];
  contentType: string;
}

const images = new mongoose.Schema({
  album: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  lastChangeTime: {
    type: Date,
    default: Date.now,
  },
  lastChangeOperation: String,
  history: [
    {
      desc: String,
      time: {
        type: Date,
        default: Date.now,
      },
      operation: String,
      path: String,
    },
  ],
  contentType: {
    type: String,
    required: true,
  },
});

export const ImageModel = mongoose.model("Image", images);
