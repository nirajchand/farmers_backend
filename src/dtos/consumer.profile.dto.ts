import { ProfileData, ProfileSchema } from "../types/consumer.profile";
import z from "zod";

// export const getProfileDto = ProfileSchema.pick({
//   userId: true,
// });

// export type GetProfileDto = z.infer<typeof getProfileDto >;


export const updateProfileDto = ProfileSchema.pick({
  fullName: true,
  email: true,
  phoneNumber: true,
  userLocation: true,
  profile_image:true
}).partial({
  fullName: true,
  email: true,
  phoneNumber: true,
  userLocation: true,
  profile_image:true
});

export type UpdateprofileDto = z.infer<typeof updateProfileDto>;

export const createProfileDto = ProfileSchema.pick({
  userId: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  userLocation: true,
  profile_image: true
}).partial({
  phoneNumber: true,
  userLocation: true,
  profile_image: true
});

export type CreateprofileDto = z.infer<typeof createProfileDto>;
