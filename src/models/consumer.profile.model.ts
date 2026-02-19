import mongoose, { Schema } from "mongoose";
import { ProfileData } from "../types/consumer.profile";

export interface IConsumerProfile extends Omit<ProfileData, "userId">, Document {
  "userId": mongoose.Types.ObjectId | string; 
    _id: mongoose.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date
  
}

const ProfileSchema: Schema = new Schema<IConsumerProfile>(
    {
        userId: {type: Schema.Types.ObjectId,ref :"Users",required: true},
        email: {type : String,required : true,unique:true},
        fullName:{type:String,required:true},
        phoneNumber: {type:String},
        userLocation: {type: String},
        profile_image: {type: String}
    },
    {
        timestamps: true,
    }
)

export const ConsumerProfileModel = mongoose.model<IConsumerProfile>("consumer_profiles",ProfileSchema)