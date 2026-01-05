import jwt from "jsonwebtoken";
import { CreateUserDto,LoginUserDTO } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../configs";


let userRepository = new UserRepository();

export class UserService{
    async createuser(data: CreateUserDto){
        // Check email exist or not
        const checkEmail = await userRepository.getUserByEmail(data.email);
        if(checkEmail){
            throw new HttpError(403,"Eamil already in use")
        }

        // Hash password 
        const hasedPassword = await bcrypt.hash(data.password,10);
        data.password = hasedPassword;

        // createUser 
        const newUser = userRepository.createUser(data);
        return newUser;
    }

    async loginUser(data: LoginUserDTO){
        // check Email
        const user = await userRepository.getUserByEmail(data.email);
        if(!user){
            throw new HttpError(404,"User not Found")
        }
        // compare password 
        const validatePassword = await bcrypt.compare(data.password, user.password)
        if(!validatePassword){
            throw new HttpError(401, "Invalid Credentials")
        };

        // Generate Jwt
        const payload= {
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role
        }

        const token = jwt.sign(payload,JWT_SECRET,{expiresIn: "30d"})

        return {token,user};

    }

    async getUserById(id: string){
        const user = userRepository.findUserById(id);
        if(!user){
            throw new HttpError(404, "User not Found")
        }
        return user;
    }
}