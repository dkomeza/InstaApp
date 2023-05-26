import formidable from "formidable";
import mongoose from "mongoose";
import * as fs from "fs";

import { UserController, TagController } from "./index.js";

import { ImageModel, PostModel } from "../models/index.js";
import { IUser, ITag, IImage, IComment } from "../models/index.js";

interface Post {
  id: string;
  author: string;
  description: string;
  images: string[];
  lastChangeTime: Date;
  lastChangeOperation: string;
  likes: string[];
  comments: {
    _id: string;
    text: string;
    author: string;
    lastChangeTime: Date;
  }[];
  liked: boolean;
  tags: string[];
}

class PostController {
  public uploadPost = async (
    token: string,
    description: string,
    tags: string[],
    images: formidable.File[]
  ) => {
    const user = await UserController.getUserByToken(token);
    if (!user.ok) {
      return { ok: false, status: "Invalid token" };
    }
    if (!user.user) {
      return { ok: false, status: "User not found" };
    }

    const User = user.user;

    checkAlbumExists(User._id.toString());

    const imageArray = [] as mongoose.Types.ObjectId[];

    for (const image of images) {
      moveImage(image, User._id.toString());

      const newImage = new ImageModel({
        album: User._id,
        originalName: image.originalFilename!,
        path: `./uploads/${User._id}/${image.newFilename!}`,
        lastChangeOperation: "create",
        history: [
          {
            desc: "Image created",
            operation: "create",
            path: `./uploads/${User._id}/${image.newFilename!}`,
          },
        ],
        contentType: image.mimetype!,
      });

      await newImage.save();
      const imageObject = newImage.toObject();
      imageArray.push(imageObject._id);
    }

    const tagsArray = await TagController.getTags(tags);

    const newPost = new PostModel({
      images: imageArray,
      author: User._id,
      description,
      lastChangeOperation: "create",
      history: [
        {
          desc: "Post created",
          operation: "create",
        },
      ],
      tags: tagsArray,
    });

    await newPost.save();

    const postObject = newPost.toObject();

    TagController.savePostToTags(tagsArray, postObject._id);

    return { ok: true, status: "ok" };
  };

  public getPosts = async (token: string, username = "") => {
    const user = await UserController.getUserByToken(token);
    if (!user.ok) {
      return { ok: false, status: "Invalid token" };
    }
    if (!user.user) {
      return { ok: false, status: "User not found" };
    }

    const posts = await PostModel.find({ username })
      .populate<{ images: IImage[] }>("images")
      .populate<{ author: IUser }>("author")
      .populate<{ likes: IUser[] }>("likes")
      .populate<{ tags: ITag[] }>("tags")
      .populate<{ comments: IComment[] }>({
        path: "comments",
        populate: [
          { path: "author", model: "User" },
          { path: "likes", model: "User" },
        ],
      });

    const likedPosts = posts.map((post) => {
      const likes = post.likes.map((like) => like._id.toString());
      return likes.includes(user.user!._id.toString());
    });

    const postsArray = [] as Post[];

    posts.forEach((post, index) => {
      const Post: Post = {
        id: post._id.toString(),
        author: post.author.username,
        description: post.description,
        images: post.images.map((image) => image._id.toString()),
        lastChangeTime: post.lastChangeTime,
        lastChangeOperation: post.lastChangeOperation,
        likes: post.likes.map((like) => like._id.toString()),
        comments: post.comments.map((comment) => {
          return {
            _id: comment._id.toString(),
            text: comment.text,
            author: comment.author.username,
            lastChangeTime: comment.lastChangeTime,
            likes: comment.likes.map((like) => like._id.toString()),
          };
        }),
        liked: likedPosts[index] || false,
        tags: post.tags.map((tag) => tag.name),
      };
      postsArray.push(Post);
    });

    return { ok: true, status: "ok", posts: postsArray };
  };

  public likePost = async (token: string, id: string) => {
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

    const likes = post.likes.map((like) => like._id.toString());
    if (likes.includes(user.user._id.toString())) {
      post.likes = post.likes.filter(
        (like) => like._id.toString() !== user.user!._id.toString()
      );
    } else {
      const userObject = new mongoose.Types.ObjectId(user.user._id);
      post.likes.push(userObject);
    }
    post.save();

    return { ok: true, status: "ok" };
  };
}

function checkAlbumExists(id: string) {
  const albumPath = `./uploads/${id}`;
  if (!fs.existsSync(albumPath)) {
    fs.mkdirSync(albumPath);
  }
}

function moveImage(image: formidable.File, id: string) {
  const oldPath = image.filepath;
  const newPath = `./uploads/${id}/${image.newFilename}`;
  fs.renameSync(oldPath, newPath);
}

export default new PostController();
