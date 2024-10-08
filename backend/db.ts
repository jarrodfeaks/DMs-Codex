import mongoose from "mongoose";

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string, { dbName: process.env.DB_NAME });
        console.log("Connected to database successfully");
    } catch (err) {
        console.error("Failed to connect to database", err);
        process.exit(1);
    }
}

export default { connect };
