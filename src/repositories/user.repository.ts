import { UserModel,IUser } from "../models/user.model"

export interface IUserRepository{
    createUser(userData: Partial<IUser>) : Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser | null>;
}


export class UserRepository implements IUserRepository{

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(userData);
        return await user.save();
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({"email": email});
        return user;
    }

}