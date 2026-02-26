import { Router } from "express";
import {
  authorizedMiddleware,
  farmerMiddleware,
} from "../../middlewares/auth.middleware";
import { OrderController } from "../../controllers/consumer/order.controller";

const router = Router();
const orderController = new OrderController();


// Farmer
router.get(
  "/farmer",
  authorizedMiddleware,
  farmerMiddleware,
  orderController.getFarmerOrders,
);
router.patch("/updateOrderStatus/:orderId", authorizedMiddleware,orderController.updateOrderStatus)

export default router;