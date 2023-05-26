import UserController from "./UserController.js";
import { CommentModel, PostModel } from "../models/index.js";
import mongoose from "mongoose";

class CommentController {
  public commentPost = async (token: string, id: string, text: string) => {
    const user = await UserController.getUserByToken(token);

    if (!user.ok) {
      return { ok: false, status: "Invalid token" };
    }
    if (!user.user) {
      return { ok: false, status: "User not found" };
    }

    const post = await PostModel.findById(id);
    if (!post) {
      return { ok: false, status: "Post not found" };
    }

    const userObject = new mongoose.Types.ObjectId(user.user._id);
    const comment = new CommentModel({
      author: userObject._id,
      text,
    });
    await comment.save();

    post.comments.push(comment._id);
    await post.save();

    return { ok: true, status: "ok" };
  };
  public likeComment = async (token: string, id: string) => {
    const user = await UserController.getUserByToken(token);

    if (!user.ok) {
      return { ok: false, status: "Invalid token" };
    }
    if (!user.user) {
      return { ok: false, status: "User not found" };
    }

    const comment = await CommentModel.findById(id);
    if (!comment) {
      return { ok: false, status: "Comment not found" };
    }

    const likes = comment.likes.map((like) => like._id.toString());

    if (likes.includes(user.user._id.toString())) {
      comment.likes = comment.likes.filter(
        (like) => like._id.toString() !== user.user!._id.toString()
      );
    } else {
      const userObject = new mongoose.Types.ObjectId(user.user._id);
      comment.likes.push(userObject);
    }

    comment.save();

    return { ok: true, status: "ok" };
  };
}

export default new CommentController();
