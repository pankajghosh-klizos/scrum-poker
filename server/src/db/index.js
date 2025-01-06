import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const mongodbUri = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${mongodbUri}/${DB_NAME}`
    );

    if (connectionInstance) {
      console.info(
        "☘️  MongoDB Connected!\n🌐 Db host:",
        connectionInstance.connection.host
      );
    }
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

export default connectDB;
