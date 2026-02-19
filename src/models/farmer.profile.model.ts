import { FarmerProfile } from "../types/farmer.profile";
import mongoose,{Schema} from "mongoose";


export interface IFarmerProfile extends Omit<FarmerProfile,"userId"> , Document{
    "userId": mongoose.Types.ObjectId | string,
    _id: mongoose.Types.ObjectId,
    createdAt:Date,
    updateAt:Date
}


const FarmerProfileSchema: Schema = new Schema<IFarmerProfile>(
    {
        userId: {type: Schema.Types.ObjectId, ref: "Users", required: true},
        email: {type: String, required: true},
        fullName: {type: String, required: true},
        farmName: {type: String},
        description: {type: String},
        farmLocation: {type: String},
        phoneNumber: {type: String},
        profile_image: {type: String},
    },
    {
        timestamps: true
    }
)

export const FarmerProfileModel = mongoose.model<IFarmerProfile>("Farmer_Profiles", FarmerProfileSchema)
