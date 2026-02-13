import { ConsumerProfileModel, IConsumerProfile } from "../models/consumer.profile.model";


export interface IConsumerProfileRespository{
    createConsumerProfile(data:Partial<IConsumerProfile>) : Promise<IConsumerProfile>;
    getProfile(userId: string) : Promise<IConsumerProfile | null>
    updateProfile(userId: string,updatedData: Partial<IConsumerProfile>) : Promise<IConsumerProfile>
    deleteUser(userId:string) : Promise<boolean>
}

export class ConsumerProfileRepository implements IConsumerProfileRespository{
    async deleteUser(userId: string): Promise<boolean> {
        const user = await ConsumerProfileModel.findByIdAndDelete(userId);
        return user? true: false;
    }
    async createConsumerProfile(data: Partial<IConsumerProfile>): Promise<IConsumerProfile> {
        return await ConsumerProfileModel.create(data);
    }

    
    async updateProfile(userId: string, updatedData: Partial<IConsumerProfile>): Promise<IConsumerProfile> {
        const updatedUser = await ConsumerProfileModel.findOneAndUpdate({userId}, updatedData, { new: true });
        return updatedUser!;
    }


    async getProfile(userId: string): Promise<IConsumerProfile | null> {
        const user = await ConsumerProfileModel.findOne({"userId":userId });
        return user;
    }

    
}