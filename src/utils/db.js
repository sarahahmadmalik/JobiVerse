import mongoose from "mongoose";

let isConnected = false;

 const connectDB = async () => {
  if (isConnected) return mongoose.connection;

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "jobiverse",
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
    });

    isConnected = true;
    console.log("MongoDB connected successfully");

    // Get collections properly
    const db = connection.connection.db;
    const collections = await db.listCollections().toArray();
    // console.log("Available collections:", collections);

    return connection;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB
