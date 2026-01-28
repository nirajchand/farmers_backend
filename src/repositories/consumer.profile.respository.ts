import { ConsumerProfileModel, IConsumerProfile } from "../models/consumer.profile.model";


export interface IConsumerProfileRespository{
    createConsumerProfile(data:Partial<IConsumerProfile>) : Promise<boolean>;
    getProfile(userId: String) : Promise<IConsumerProfile | null>
    updateProfile(userId: String,updatedData: Partial<IConsumerProfile>) : Promise<IConsumerProfile>
}

export class ConsumerProfileRepository implements IConsumerProfileRespository{
    async createConsumerProfile(data: Partial<IConsumerProfile>): Promise<boolean> {
        await ConsumerProfileModel.create(data);
        return true;
    }

    
    async updateProfile(userId: string, updatedData: Partial<IConsumerProfile>): Promise<IConsumerProfile> {
        const updatedUser = await ConsumerProfileModel.findOneAndUpdate({userId}, updatedData, { new: true });
        return updatedUser!;
    }


    async getProfile(userId: String): Promise<IConsumerProfile | null> {
        const user = await ConsumerProfileModel.findOne({"userId":userId });
        return user;
    }
}