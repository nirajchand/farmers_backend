import z from "zod";

export const UserSchema = z.object({
    fullName: z.string(),
    email: z.email(),
    password: z.string().min(6),
    role : z.enum(["farmer","consumer"]).default("consumer")
})

export type UserType = z.infer< typeof UserSchema>;


