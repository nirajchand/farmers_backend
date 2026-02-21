import { Router } from "express";
import {
  authorizedMiddleware,
  consumerMidddleware,
  farmerMiddleware,
} from "../../middlewares/auth.middleware";
import { OrderController } from "../../controllers/consumer/order.controller";

console.log("Order routes loaded");

const router = Router();
const orderController = new OrderController();

// Consumer
router.post(
  "/placeOrder",
  authorizedMiddleware,
  consumerMidddleware,
  orderController.placeOrder,
);

router.get(
  "/my",
  authorizedMiddleware,
  consumerMidddleware,
  orderController.getMyOrders,
);

router.patch(
  "/:id/cancel",
  authorizedMiddleware,
  consumerMidddleware,
  orderController.cancelOrder,
);

// Farmer
router.get(
  "/farmer",
  authorizedMiddleware,
  farmerMiddleware,
  orderController.getFarmerOrders,
);

export default router;