import mongoose from "mongoose";
import config from '../config/config';
export const databaseConnection = async () => {
    try {
        await mongoose.connect(config.dbURI)
        console.log('database connected succesful')
    } catch (error) {
        console.log('error in db connection -->', error);
    }
}