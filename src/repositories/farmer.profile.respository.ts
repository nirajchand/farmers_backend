import {
  FarmerProfileModel,
  IFarmerProfile,
} from "../models/farmer.profile.model";
import { farmerProfile } from "../types/farmer.profile";

export interface IFarmerProfileRepository {
  createFarmerProfile(data: Partial<IFarmerProfile>): Promise<IFarmerProfile>;
  getFarmerProfile(userId: string): Promise<IFarmerProfile | null>;
  updateFarmerProfile(
    userId: string,
    data: Partial<IFarmerProfile>,
  ): Promise<IFarmerProfile>;
  deleteUser(userId: string): Promise<boolean>;
}

export class FarmerProfileRepository implements IFarmerProfileRepository {
  async deleteUser(userId: string): Promise<boolean> {
    const user = await FarmerProfileModel.findByIdAndDelete(userId);
    return user ? true : false;
  }

  async createFarmerProfile(
    data: Partial<IFarmerProfile>,
  ): Promise<IFarmerProfile> {
    const result = FarmerProfileModel.create(data);
    return result;
  }
  async getFarmerProfile(userId: string): Promise<IFarmerProfile | null> {
    const profile = await FarmerProfileModel.findOne({ userId: userId });
    return profile;
  }
  async updateFarmerProfile(
    userId: string,
    data: Partial<IFarmerProfile>,
  ): Promise<IFarmerProfile> {
    const updatedUser = await FarmerProfileModel.findOneAndUpdate(
      { userId },
      data,
      { new: true },
    );
    return updatedUser!;
  }
}
