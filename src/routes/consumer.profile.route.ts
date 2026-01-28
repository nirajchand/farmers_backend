import { ConsumerProfileController } from "../controllers/consumer.profile.controller";
import { Router } from "express";
import { uploads } from "../middlewares/upload.middleware";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

let consumerProfileController = new ConsumerProfileController();

let router = Router()

router.get("/getProfile",authorizedMiddleware,consumerProfileController.getConsumerProfile)
router.put("/updateProfile",authorizedMiddleware,uploads.single("profile_image"),consumerProfileController.updateConsumerProfile)
// router.put("/createProfile",consumerProfileController.createConsumerProfile)

export default router;

