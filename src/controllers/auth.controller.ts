import { UserService } from "../services/user.service";
import {
  createUserDto,
  CreateUserDto,
  loginUserDTO,
  LoginUserDTO,
  userDto,
} from "../dtos/user.dto";
import { Request, Response } from "express";
import z, { safeParse, success } from "zod";
import { ConsumerProfileServices } from "../services/consumer/consumer.profile.service";
import { CreateprofileDto } from "../dtos/consumer.profile.dto";
import { CreateFarmerProfileDto } from "../dtos/farmer.profile.dto";
import { FarmerProfileServices } from "../services/farmer/farmer.services";

let userService = new UserService();
let consumerProfileService = new ConsumerProfileServices();
let farmerProfileService = new FarmerProfileServices();

export class AuthController {
  async registerUser(req: Request, res: Response) {
    try {
      const parseData = createUserDto.safeParse(req.body);
      if (!parseData.success) {
        return res.status(400).json({
          success: false,
          message: parseData.error.format(),
        });
      }

      const userData: CreateUserDto = parseData.data;
      const newUser = await userService.createuser(userData);

      if (newUser.role === "consumer") {
        try {
          const profileData: CreateprofileDto = {
            userId: newUser._id.toString(),
            fullName: newUser.fullName,
            email: newUser.email,
          };

          await consumerProfileService.createConsumerProfile(profileData);
        } catch (profileError) {
          console.error("Profile creation failed:", profileError);
        }
      }

      if (newUser.role === "farmer") {
        try {
          const profileData: CreateFarmerProfileDto = {
            userId: newUser._id.toString(),
            fullName: newUser.fullName,
            email: newUser.email,
          };

          await farmerProfileService.CreateFarmerProfile(profileData);
        } catch (profileError) {
          console.error("Profile creation failed:", profileError);
        }
      }

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error: any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async loginUser(req: Request, res: Response) {
    try {
      const parseData = loginUserDTO.safeParse(req.body);
      if (!parseData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parseData.error) });
      }

      const loginData: LoginUserDTO = parseData.data;

      const { token, user } = await userService.loginUser(loginData);
      return res
        .status(200)
        .json({ success: true, message: "Login Success", data: user, token });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal server error",
      });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await userService.getUserById(id);
      const parseData = userDto.safeParse(user);
      return res
        .status(200)
        .json({ success: true, message: "User Found", parseData });
    } catch (err: Error | any) {
      return res.status(err.statusCode ?? 500).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }

  async requestPasswordChange(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await userService.sendResetPasswordEmail(email);
      return res.status(200).json({
        success: true,
        data: user,
        message: "Password reset email sent",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const token = req.params.token;
      const { newPassword } = req.body;
      await userService.resetPassword(token, newPassword);
      return res.status(200).json({
        success: true,
        message: "Password has been reset successfully.",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
