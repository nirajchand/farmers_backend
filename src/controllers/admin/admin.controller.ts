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
import { ConsumerProfileServices } from "../../services/consumer.profile.service";
import { CreateprofileDto } from "../../dtos/consumer.profile.dto";

let adminUserService = new AdminServices();
let consumerProfileServices = new ConsumerProfileServices();

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
      const users = await adminUserService.getAllUsers();
      return res
        .status(200)
        .json({ success: true, data: users, message: "All Users Retrieved" });
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
      const parsedData = updateUserDto.safeParse(req.body); // validate request body
      if (!parsedData.success) {
        // validation failed
        return res
          .status(400)
          .json({ success: false, message: z.prettifyError(parsedData.error) });
      }

      if (req.file) {
        parsedData.data.profile_image = `/uploads/${req.file.filename}`;
      }
      const updateData: UpdateUserDto = parsedData.data;
      const updatedUser = await adminUserService.updateUser(userId, updateData);
      if (updatedUser.data.role == "consumer") {
        await consumerProfileServices.updateConsumerProfile(updateData, userId);
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

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.id;
      const user = await adminUserService.getUserById(userId);
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
