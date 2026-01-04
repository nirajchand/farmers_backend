import { UserService } from "../services/user.service";
import { createUserDto, CreateUserDto,loginUserDTO,LoginUserDTO } from "../dtos/user.dto";
import { Request,Response } from "express";
import z, { safeParse, success } from "zod";
import { error } from "node:console";

let userService = new UserService();

export class AuthController{
    async registerUser(req: Request, res:Response){
        try{
            const parseData = createUserDto.safeParse(req.body);
            if(!parseData.success){
                return res.status(400).json(
                    {success : false, message: z.prettifyError(parseData.error)}
                )
            }

            const userData: CreateUserDto = parseData.data
            const newUser = await userService.createuser(userData);
            return res.status(201).json(
                {success: true ,message: "User Created", data: newUser}
            )
        }catch(error: Error | any){
            return res.status(error.statusCode ?? 500).json(
                {success: false , message: error.message || "Internal server error"}
            )
        }
    }

    async loginUser(req: Request, res:Response){
        try{
            const parseData = loginUserDTO.safeParse(req.body);
            if(!parseData.success){
                return res.status(400).json(
                    {success: false, message : z.prettifyError(parseData.error)}
                )
            }

            const loginData: LoginUserDTO = parseData.data;
            const{token, user} = await userService.loginUser(loginData);
            res.status(200).json(
                {success: true, message: "Login Success", data: user, token}
            )
        }catch(error: Error | any){
            return res.status(error.statusCode ?? 500).json(
                {success: false, message: error.message || "Internal server error"}
            )
        }

    }



}