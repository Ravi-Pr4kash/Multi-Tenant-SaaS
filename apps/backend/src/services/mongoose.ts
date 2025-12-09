import mongoose from "mongoose";

export async function connectMongoose() {
    const uri = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017'
    const dbName = process.env.MONGO_DB || 'Tenant'

    await mongoose.connect(uri, { dbName })
}