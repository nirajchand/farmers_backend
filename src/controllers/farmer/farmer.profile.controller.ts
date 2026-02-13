
import { Request, Response } from "express";
import { UserService } from "../../services/user.service";
import { FarmerProfileServices } from "../../services/farmer/farmer.services";
import { updateFarmerProfileDto } from "../../dtos/farmer.profile.dto";

let farmerProfileServices = new FarmerProfileServices();
let userServices = new UserService();

export class FarmerProfileController {
  async getFarmerProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;
      const userData = await farmerProfileServices.getFarmerProfile(userId);
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

  async updateFarmerProfile(req: Request, res: Response) {
    try {
      const userId = req.user?._id;

      const parseData = updateFarmerProfileDto.safeParse(req.body);
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
      const result = await farmerProfileServices.updateFarmerProfile(
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
