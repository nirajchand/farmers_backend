import { ConsumerProfileController } from "../../controllers/consumer/consumer.profile.controller";
import { Router } from "express";
import { uploads } from "../../middlewares/upload.middleware";
import { authorizedMiddleware,consumerMidddleware } from "../../middlewares/auth.middleware";
import { ProductController } from "../../controllers/farmer/product.controller";

let consumerProfileController = new ConsumerProfileController();
let productController = new ProductController();

let router = Router()
router.use(authorizedMiddleware);
router.use(consumerMidddleware);

router.get("/getProfile",consumerProfileController.getConsumerProfile);
router.put("/updateProfile",uploads.single("profile_image"),consumerProfileController.updateConsumerProfile);

// ----------------products------------------------
router.get("/products", productController.getAllProducts)
router.get("/:id", productController.getProductById);



export default router;

