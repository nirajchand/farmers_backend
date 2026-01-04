import z from "zod";
import { UserSchema } from "../types/user.type";

export const createUserDto = UserSchema.pick(
    {
        fullName: true,
        email: true,
        password: true,
    }
).extend(
    {
        confirmPassword: z.string().min(6),
    }
).refine(
    (data) => data.password === data.confirmPassword,
    {
        message: "Passwords don't match ",
        path: ["confirmPassword"]
    }
)

export type CreateUserDto = z.infer< typeof createUserDto>;

export const loginUserDTO = UserSchema.pick({
    email: true,
    password: true,
})

export type LoginUserDTO = z.infer<typeof loginUserDTO>
