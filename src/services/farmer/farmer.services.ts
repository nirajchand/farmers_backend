import { CreateFarmerProfileDto,UpdateFarmerProfileDto } from "../../dtos/farmer.profile.dto";
import { HttpError } from "../../errors/http-error";
import { FarmerProfileRepository } from "../../repositories/farmer.profile.respository";

let farmerProfileRepository = new FarmerProfileRepository();

export class FarmerProfileServices {
  async CreateFarmerProfile(data: CreateFarmerProfileDto) {
    const checkUser = await farmerProfileRepository.getFarmerProfile(
      data.userId,
    );
    if (checkUser) {
      throw new HttpError(402,"User already exist");
    }

    const createUser = await farmerProfileRepository.createFarmerProfile(data);
    if (!createUser) {
      throw new HttpError(500, "Failed to create profile");
    }
    return {
      success: true,
      message: "profile created",
    };
  }

   async getFarmerProfile(userId: string ) {
      const user = await farmerProfileRepository.getFarmerProfile(userId);
      if (!user) {
        throw new HttpError(404, "User not Found");
      }
      return user;
    }
  
    async updateFarmerProfile(data: UpdateFarmerProfileDto,userId: string) {
      const isUpdated = await farmerProfileRepository.updateFarmerProfile(
        userId,
        data,
      );
  
      if (!isUpdated) {
        throw new HttpError(404, "User not found or no changes made");
      }
  
      return { success: true, message: "Profile updated successfully",data: isUpdated };
    }
  
}
