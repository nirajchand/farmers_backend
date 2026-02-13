import { Router } from "express";
import { adminMiddleware, authorizedMiddleware } from "../../middlewares/auth.middleware";
import { uploads } from "../../middlewares/upload.middleware";
import { AdminUserController } from "../../controllers/admin/admin.controller";

let adminUserController = new AdminUserController

const router = Router()

router.use(authorizedMiddleware);
router.use(adminMiddleware);

router.post("/", uploads.single("profile_image"), adminUserController.createUser);
router.get("/", adminUserController.getAllUsers);
router.put("/:id", uploads.single("profile_image"), adminUserController.updateUser);
router.delete("/:id", adminUserController.deleteUser);
router.get("/consumer/:id", adminUserController.getConsumerById);
router.get("/farmer/:id", adminUserController.getFarmerById);

export default router;