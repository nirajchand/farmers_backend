import z from "zod";

export const UserSchema = z.object({
  fullName: z.string().trim(),
  email: z.email(),
  password: z.string().min(6),
  role: z.enum(["farmer", "consumer", "admin"]),
  profile_image: z.string().optional(),
});

export type UserType = z.infer<typeof UserSchema>;
