import z from 'zod';

export const farmerProfile = z.object({
    userId: z.string(),
    fullName: z.string().trim(),
    email: z.email(),
    farmName: z.string().trim(),
    description: z.string().trim().optional(),
    farmLocation: z.string().trim().optional(),
    phoneNumber: z.string().min(10).trim().optional(),
    profile_image: z.any().optional()
})

export type FarmerProfile = z.infer< typeof farmerProfile>;