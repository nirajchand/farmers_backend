import { farmerProfile } from "../types/farmer.profile";
import z, { email } from 'zod';

export const createFarmerProfileDto = farmerProfile.pick({
    userId:true,
    fullName: true,
    email:true,
    profile_image: true,
}).partial({
    profile_image: true
})

export type CreateFarmerProfileDto = z.infer<typeof createFarmerProfileDto>


export const updateFarmerProfileDto = farmerProfile.omit({userId: true}).partial();
export type UpdateFarmerProfileDto = z.infer<typeof updateFarmerProfileDto>