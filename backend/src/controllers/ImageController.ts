import * as fs from "fs";
import formidable from "formidable";
import { ImageModel, Image } from "../models/ImageModel.js";
import { PostModel } from "../models/PostModel.js";
import { User } from "../models/UserModel.js";
import { TagModel, Tag } from "../models/TagModel.js";
import { CommentModel, IComment } from "../models/CommentModel.js";
import UserController from "./UserController.js";
import mongoose from "mongoose";
import sharp from "sharp";

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

class FileController {
  public async savePost(
    token: string,
    description: string,
    tags: string[],
    images: formidable.File[]
  ) {
    const user = await UserController.getUserByToken(token);
    if (!user.ok) {
      return { ok: false, status: "Invalid token" };
    }
    if (!user.user) {
      return { ok: false, status: "User not found" };
    }

    const User = user.user;

    this.checkAlbumExists(User._id.toString());

    const imageArray = [] as mongoose.Types.ObjectId[];

    for (const image of images) {
      this.moveImage(image, User._id.toString());

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

    const tagsArray = await this.getTags(tags);

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

    this.savePostToTags(tagsArray, postObject._id);

    return { ok: true, status: "ok" };
  }

  private checkAlbumExists(album: string) {
    const albumPath = `./uploads/${album}`;
    if (!fs.existsSync(albumPath)) {
      fs.mkdirSync(albumPath);
    }
  }

  private moveImage(image: formidable.File, album: string) {
    const oldPath = image.filepath;
    const newPath = `./uploads/${album}/${image.newFilename}`;
    fs.renameSync(oldPath, newPath);
  }

  private async getTags(tags: string[]) {
    const tagsArray = [] as mongoose.Types.ObjectId[];
    for (const tag of tags) {
      const tagExists = await TagModel.findOne({ name: tag });
      if (tagExists) {
        tagExists.popularity++;
        await tagExists.save();
        tagsArray.push(tagExists._id);
      } else {
        const newTag = new TagModel({
          name: tag,
        });
        await newTag.save();
        tagsArray.push(newTag._id);
      }
    }

    return tagsArray;
  }

  private async savePostToTags(
    tags: mongoose.Types.ObjectId[],
    post: mongoose.Types.ObjectId
  ) {
    for (const tag of tags) {
      const tagObject = await TagModel.findById(tag);
      if (tagObject) {
        tagObject.posts.push(post);
        await tagObject.save();
      }
    }
  }

  public getPosts = async (token: string, username = "") => {
    const user = await UserController.getUserByToken(token);
    if (!user.ok) {
      return { ok: false, status: "Invalid token" };
    }
    if (!user.user) {
      return { ok: false, status: "User not found" };
    }

    const posts = await PostModel.find({ username })
      .populate<{ images: Image[] }>("images")
      .populate<{ author: User }>("author")
      .populate<{ likes: User[] }>("likes")
      .populate<{ tags: Tag[] }>("tags")
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

  public getImage = async (id: string) => {
    const image = await ImageModel.findById(id);
    if (!image) {
      return { ok: false, status: "Image not found" };
    }

    return { ok: true, status: "ok", image };
  };

  public getPreview = async (id: string) => {
    const image = await ImageModel.findById(id);
    if (!image) {
      return { ok: false, status: "Image not found" };
    }

    const previewPath = "." + image.path.split(".")[1] + "_preview.webp";

    if (!fs.existsSync(previewPath)) {
      await new Promise<string>((resolve) => {
        sharp(image.path)
          .resize(300)
          .webp({ quality: 80 })
          .toFile(previewPath, (err) => {
            if (err) {
              console.log(err);
            }
            resolve(previewPath);
          });
      });
    }

    return { ok: true, status: "ok", previewPath };
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

  public searchTags = async (search: string, usedTags: string[]) => {
    const tags = await TagModel.find({
      $and: [
        { name: { $regex: `${search}`, $options: "i" } },
        { name: { $nin: usedTags } },
      ],
    })
      .sort({
        popularity: -1,
      })
      .limit(10);

    return { ok: true, status: "ok", tags };
  };

  public getUserPosts = async (username: string) => {
    const posts = await PostModel.find({ author: username })
      .populate<{ images: Image[] }>("images")
      .populate<{ author: User }>("author")
      .populate<{ likes: User[] }>("likes")
      .populate<{ tags: Tag[] }>("tags")
      .populate<{ comments: IComment[] }>({
        path: "comments",
        populate: [
          { path: "author", model: "User" },
          { path: "likes", model: "User" },
        ],
      });
  };
}

export default new FileController();
