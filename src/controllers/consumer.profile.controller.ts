import { success } from "zod";
import {
  CreateprofileDto,
  createProfileDto,
  UpdateprofileDto,
  updateProfileDto,
} from "../dtos/consumer.profile.dto";
import { ConsumerProfileServices } from "../services/consumer.profile.service";
import { Request, Response } from "express";

let consumerProfileServices = new ConsumerProfileServices();

export class ConsumerProfileController {
  async getConsumerProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      const userData = await consumerProfileServices.getConsumerProfile(userId);
      return res.status(200).json({
        success: true,
        message: "User fetched",
        data: userData,
      });
    } catch (err: Error | any) {
      return res.status(err.statusCode ?? 501).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }

  async updateConsumerProfile(req: Request, res: Response) {
    try {
      // const { userId } = req.params;

      const userId = req.user?._id;

      const parseData = updateProfileDto.safeParse(req.body);
      if (!parseData.success) {
        return res.status(400).json({
          success: false,
          message: parseData.error,
        });
      }
      if (req.file) {
        // if new image uploaded through multer
        parseData.data.profile_image = `/uploads/${req.file.filename}`;
      }
      const result = await consumerProfileServices.updateConsumerProfile(
        parseData.data,
        userId,
      );
      return res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.data
      });
    } catch (err: Error | any) {
      return res.status(err.statusCode ?? 501).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }

  //   async createConsumerProfile(req: Request, res: Response) {
  //     try {
  //       const parseData = createProfileDto.safeParse(req.body);
  //       if (!parseData.success) {
  //         return res.status(402).json({
  //           success: false,
  //           message: parseData.error,
  //         });
  //       }
  //       const profileData: CreateprofileDto = parseData.data;
  //       const result =
  //         await consumerProfileServices.createConsumerProfile(profileData);
  //       return res.status(200).json({
  //         success: result.success,
  //         message: result.message,
  //       });
  //     } catch (err: Error | any) {
  //       return res.status(err.statusCode ?? 501).json({
  //         success: false,
  //         message: err.message || "Internal server error",
  //       });
  //     }
  //   }
}
