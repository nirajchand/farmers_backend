import { Router } from "express";
import { CartController } from "../../controllers/consumer/cart.controller";
import {
  authorizedMiddleware,
  consumerMidddleware,
} from "../../middlewares/auth.middleware";

let router = Router();
let cartController = new CartController();

router.use(authorizedMiddleware);
router.use(consumerMidddleware);

router.get("/getCart", cartController.getCart);
router.post("/add", cartController.addItem);
router.delete("/remove/:cartItemId", cartController.removeItem);
router.put("/update", cartController.updateItem);

export default router;
