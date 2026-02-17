import { Router } from "express";
import { uploads } from "../../middlewares/upload.middleware";
import {
  authorizedMiddleware,
  farmerMiddleware,
} from "../../middlewares/auth.middleware";
import { ProductController } from "../../controllers/farmer/product.controller";

let productController = new ProductController();

let router = Router();
router.use(authorizedMiddleware);
router.use(farmerMiddleware);

router.post(
  "/addProduct",
  uploads.single("product_image"),
  productController.createProduct,
);
router.put(
  "/:id",
  uploads.single("product_image"),
  productController.updateProduct,
);
router.get("/farmerProducts", productController.getProductsByFarmerId);
router.get("/:id", productController.getProductById);
router.delete("/:id", productController.deleteProduct);

export default router;
