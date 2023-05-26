import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const { MONGO_URI } = process.env;

mongoose.set("strictQuery", true);

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI!);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
