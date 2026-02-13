import {UpdateprofileDto,CreateprofileDto } from "../../dtos/consumer.profile.dto";
import { HttpError } from "../../errors/http-error";
import { ConsumerProfileRepository } from "../../repositories/consumer.profile.respository";

let consumerProfileRepository = new ConsumerProfileRepository();

export class ConsumerProfileServices {
  async getConsumerProfile(userId: string ) {
    const user = await consumerProfileRepository.getProfile(userId);
    if (!user) {
      throw new HttpError(404, "User not Found");
    }
    return user;
  }

  async updateConsumerProfile(data: UpdateprofileDto,userId: string) {
    const isUpdated = await consumerProfileRepository.updateProfile(
      userId,
      data,
    );
    
    if (!isUpdated) {
      throw new HttpError(404, "User not found or no changes made");
    }

    return { success: true, message: "Profile updated successfully",data: isUpdated };
  }

  async createConsumerProfile(data: CreateprofileDto) {
    const checkUser = await consumerProfileRepository.getProfile(data.userId);
    if (checkUser) {
      throw new HttpError(402, "user already exist");
    }

    const isCreated =
      await consumerProfileRepository.createConsumerProfile(data);

    if (!isCreated) {
      throw new HttpError(500, "Failed to create profile");
    }
    return {
      success: true,
      message: "profile created",
    };
  }
}
