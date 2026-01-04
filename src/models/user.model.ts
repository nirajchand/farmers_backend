import { UserType } from "../types/user.type";
import mongoose, { Mongoose,Schema } from "mongoose";


const UserSchema: Schema = new Schema<UserType>(
    {
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        fullName: { type: String, required: true },
        role: {
          type: String,
          enum: ["farmer", "consumer"],
          default: "consumer",
        },
    },
    {
        timestamps: true,
    }
);

export interface IUser extends UserType, Document {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const UserModel = mongoose.model<IUser>("User",UserSchema);


