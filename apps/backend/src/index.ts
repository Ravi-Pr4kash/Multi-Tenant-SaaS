import "dotenv/config"
import app from "./app";
import mongoose from "mongoose";
import { connectMongoose } from "./services/mongoose";


const PORT = process.env.PORT || 4000;

async function start() {
    try {
        await connectMongoose()
        console.log('MongoDB connected');
        
        app.listen(PORT, () => {
            console.log(`Backend running on port ${PORT}`);
            
        })
    } catch (error) {
        console.error('Failed to start server:', error);
    process.exit(1);
    }
}

start()