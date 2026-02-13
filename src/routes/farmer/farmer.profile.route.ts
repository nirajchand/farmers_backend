import { Router } from "express";
import { uploads } from "../../middlewares/upload.middleware";
import { authorizedMiddleware } from "../../middlewares/auth.middleware";
import { FarmerProfileController } from "../../controllers/farmer/farmer.profile.controller";

let farmerProfileController = new FarmerProfileController();

let router = Router()

router.get("/getProfile",authorizedMiddleware,farmerProfileController.getFarmerProfile)
router.put("/updateProfile",authorizedMiddleware,uploads.single("profile_image"),farmerProfileController.updateFarmerProfile)

export default router;

