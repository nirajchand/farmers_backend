import { Router } from "express";
import { uploads } from "../../middlewares/upload.middleware";
import { authorizedMiddleware, farmerMiddleware } from "../../middlewares/auth.middleware";
import { FarmerProfileController } from "../../controllers/farmer/farmer.profile.controller";

let farmerProfileController = new FarmerProfileController();

let router = Router()
router.use(authorizedMiddleware);
router.use(farmerMiddleware)

router.get("/getProfile",farmerProfileController.getFarmerProfile)
router.put("/updateProfile",uploads.single("profile_image"),farmerProfileController.updateFarmerProfile)

export default router;

