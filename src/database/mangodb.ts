import mongoose from "mongoose";
import { MONGODB_URI } from "../configs";

export async function connectDatabase(){
    try{
        await mongoose.connect(MONGODB_URI);
        console.log("Mango connected")
    }catch(e){
        console.error("Database error: ", e);
        process.exit(1);
    }
}