import { PostModel, IImage, IUser, ITag, IComment } from "../models/index.js";

class ProfileController {
  public getUserPosts = async (username: string) => {
    const posts = await PostModel.find({ author: username })
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
  };
}

export default new ProfileController();
