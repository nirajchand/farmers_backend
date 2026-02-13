import { success } from "zod";
import {
  updateProfileDto,
} from "../../dtos/consumer.profile.dto";
import { ConsumerProfileServices } from "../../services/consumer/consumer.profile.service";
import { Request, Response } from "express";
import { UserService } from "../../services/user.service";

let consumerProfileServices = new ConsumerProfileServices();
let userServices = new UserService();

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
      if (result != null) {
        await userServices.updateUser(parseData.data, userId);
      }
      return res.status(200).json({
        success: result.success,
        message: result.message,
        data: result.data,
      });
    } catch (err: Error | any) {
      return res.status(err.statusCode ?? 501).json({
        success: false,
        message: err.message || "Internal server error",
      });
    }
  }
}
