import {
  CreateUserDto,
  createUserDto,
  LoginUserDTO,
  UpdateUserDto,
  updateUserDto,
} from "../../dtos/user.dto";
import { Request, Response, NextFunction } from "express";
import z from "zod";
import { AdminServices } from "../../services/admin/admin.services";
import { ConsumerProfileServices } from "../../services/consumer/consumer.profile.service";
import { CreateprofileDto } from "../../dtos/consumer.profile.dto";
import { CreateFarmerProfileDto } from "../../dtos/farmer.profile.dto";
import { FarmerProfileServices } from "../../services/farmer/farmer.services";

let adminUserService = new AdminServices();
let consumerProfileServices = new ConsumerProfileServices();
let farmerProfileServices = new FarmerProfileServices();

interface QueryParams {
  page?: string;
  size?: string;
}

export class AdminUserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = createUserDto.safeParse(req.body);
      if (!parsedData.success) {
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        parsedData.data.profile_image = `/uploads/${req.file.filename}`;
      }
      const userData: CreateUserDto = parsedData.data;
      const newUser = await adminUserService.createUser(userData);
      if (newUser.role === "consumer") {
        try {
          const profileData: CreateprofileDto = {
            userId: newUser._id.toString(),
            fullName: newUser.fullName,
            email: newUser.email,
            profile_image: newUser.profile_image,
          };

          await consumerProfileServices.createConsumerProfile(profileData);
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
            profile_image: newUser.profile_image,
          };

          await farmerProfileServices.CreateFarmerProfile(profileData);
        } catch (profileError) {
          console.error("Profile creation failed:", profileError);
        }
      }
      return res
        .status(201)
        .json({ success: true, message: "User Created", data: newUser });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, size }: QueryParams = req.query;
      const { users, pagination } = await adminUserService.getAllUsers({
        page,
        size,
      });
      return res.status(200).json({
        success: true,
        data: users,
        pagination,
        message: "All Users Retrieved",
      });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const data = req.body;
      if (req.file) {
        data.profile_image = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await adminUserService.updateUser(userId, data);
      if (updatedUser.data.role == "consumer") {
        await consumerProfileServices.updateConsumerProfile(data, userId);
      }
      if (updatedUser.data.role == "farmer") {
        await farmerProfileServices.updateFarmerProfile(data, userId);
      }
      return res
        .status(200)
        .json({ success: true, message: "User Updated", data: updatedUser });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const deleted = await adminUserService.deleteUser(userId);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }
      return res.status(200).json({ success: true, message: "User Deleted" });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getConsumerById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await adminUserService.getConsumerById(userId);

      return res
        .status(200)
        .json({ success: true, data: user, message: "Single User Retrieved" });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
  async getFarmerById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await adminUserService.getFarmerById(userId);
      return res
        .status(200)
        .json({ success: true, data: user, message: "Single User Retrieved" });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
}
