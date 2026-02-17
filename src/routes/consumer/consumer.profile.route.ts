import { ConsumerProfileController } from "../../controllers/consumer/consumer.profile.controller";
import { Router } from "express";
import { uploads } from "../../middlewares/upload.middleware";
import { authorizedMiddleware,consumerMidddleware } from "../../middlewares/auth.middleware";

let consumerProfileController = new ConsumerProfileController();

let router = Router()
router.use(authorizedMiddleware);
router.use(consumerMidddleware);

router.get("/getProfile",consumerProfileController.getConsumerProfile)
router.put("/updateProfile",uploads.single("profile_image"),consumerProfileController.updateConsumerProfile)

export default router;

