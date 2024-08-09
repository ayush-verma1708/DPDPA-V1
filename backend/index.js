import mongoose from 'mongoose';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import { app } from './app.js'

dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000);
    console.log(`Server is running on PORT: ${process.env.PORT}`);
})
.catch((err) => {
    console.log("MongoDb Connection Failed !!! ", err);
});