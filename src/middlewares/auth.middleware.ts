import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../configs";
import { IUser } from "../models/user.model";
import { UserRepository } from "../repositories/user.repository";
import { HttpError } from "../errors/http-error";
import { success } from "zod";


declare global{
    namespace Express{
        interface Request{
            user?: Record<string, any> | IUser
        }
    }
}

let userRepository = new UserRepository();

export const authorizedMiddleware = 
    async(req: Request, res: Response, next: NextFunction) => {
        try{
            const authHeader = req.headers.authorization;
            if(!authHeader || !authHeader.startsWith("Bearer ")){
                throw new HttpError(401,"Unathurized jwt validation")
            }

            const token = authHeader.split(" ")[1];
            if(!token) throw new HttpError(401,"Unathorized JWT missing");
            const decodedToken = jwt.verify(token,JWT_SECRET) as Record<string, any>;
            if(!decodedToken || !decodedToken.id){
                throw new HttpError(401,"Unathurized jwt unverified")
            }
            const user = userRepository.findUserById(decodedToken.id)
            if(!user) throw new HttpError(402,"Unauthorized user not found")
            req.user = user
            next();
        }catch(error: Error | any){
            return res.status( error.statusCode || 500).json(
                {success: false, message: error.message}
            )
        }
    }