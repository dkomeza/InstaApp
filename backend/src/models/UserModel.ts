import mongoose from "mongoose";

export interface User {
  _id: string;
  username: string;
  email: string;
  name: string;
  surname: string;
  password: string;
  createdAt: Date;
  verified: boolean;
}

const users = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

export const UserModel = mongoose.model<User>("User", users);
