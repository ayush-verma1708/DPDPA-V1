import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

const connectDb = async () =>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`\nMongo DB Connected !! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Mongo Db Connect error ", error);
        process.exit(1);
    }
}

export default connectDb;