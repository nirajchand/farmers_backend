import { UserModel,IUser } from "../models/user.model"

export interface IUserRepository{
    createUser(userData: Partial<IUser>) : Promise<IUser>;
    getUserByEmail(email: string): Promise<IUser | null>;
    findUserById(id: String): Promise<IUser | null>;
    updateUser(id: String,newData: Partial<IUser>): Promise<IUser | null>;
    getAllUsers():Promise<IUser[]>;
    deleteUser(id: string): Promise<boolean>;
}


export class UserRepository implements IUserRepository{
    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.findByIdAndDelete(id);
        return result? true: false;
    }
    async getAllUsers(): Promise<IUser[]> {
        const users  = await UserModel.find();
        return users;
    }
    async updateUser(id: String, newData: Partial<IUser>): Promise<IUser | null> {
        const user = await UserModel.findByIdAndUpdate(id,newData,{new : true});
        return user;
    }

    async createUser(userData: Partial<IUser>): Promise<IUser> {
        const user = new UserModel(userData);
        return await user.save();
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        const user = await UserModel.findOne({"email": email});
        return user;
    }
    
    async findUserById(id: String): Promise<IUser | null> {
        const user = await UserModel.findById(id);
        return user;
    }

}