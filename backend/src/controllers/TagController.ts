import mongoose from "mongoose";

import { TagModel } from "../models/index.js";

class TagController {
  public getTags = async (tags: string[]) => {
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
  };

  public savePostToTags = async (
    tags: mongoose.Types.ObjectId[],
    post: mongoose.Types.ObjectId
  ) => {
    for (const tag of tags) {
      const tagObject = await TagModel.findById(tag);
      if (tagObject) {
        tagObject.posts.push(post);
        await tagObject.save();
      }
    }
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
}

export default new TagController();
