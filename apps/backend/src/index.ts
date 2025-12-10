import 'dotenv/config'
import { connectMongoose } from './services/mongoose';
import app from './app';


const PORT = process.env.PORT || 30001;

async function start() {
    try {
        await connectMongoose();
        console.log("Connected to mongoose");
        
        app.listen(PORT)
        console.log(`Running on ${PORT}`);
        
    } catch (error) {
        console.log(error);
        
    }
}
start()