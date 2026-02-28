import { Request, Response } from "express";
import { OrderService } from "../../services/consumer/order.services";
import { placeOrderDto } from "../../dtos/order.dto";
import { ConsumerProfileServices } from "../../services/consumer/consumer.profile.service";
import { FarmerProfileServices } from "../../services/farmer/farmer.services";

export class OrderController {
  private orderService = new OrderService();
  private consumerProfileServices = new ConsumerProfileServices();
  private farmerProfileServices = new FarmerProfileServices();

  placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const parsed = placeOrderDto.parse(req.body);
      const userId = req.user?._id;

      const consumer =
        await this.consumerProfileServices.getConsumerProfile(userId);

      const newOrder = await this.orderService.placeOrder({
        consumerId: consumer._id.toString(),
        shippingAddress: parsed.shippingAddress,
        paymentMethod: parsed.paymentMethod,
        deliveryFee: parsed.deliveryFee ?? 0,
      });

      res.status(201).json({ success: true, data: newOrder });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;

      const consumer =
        await this.consumerProfileServices.getConsumerProfile(userId);

      const orders = await this.orderService.getConsumerOrders(
        consumer._id.toString(),
      );

      res.status(200).json({ success: true, data: orders });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getFarmerOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;

      const farmer = await this.farmerProfileServices.getFarmerProfile(userId);

      const orders = await this.orderService.getFarmerOrders(
        farmer._id.toString(),
      );

      res.status(200).json({ success: true, data: orders });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.orderService.getOrderById(req.params.id);
      res.status(200).json({ success: true, data: order });
    } catch (err: any) {
      res.status(404).json({ success: false, message: err.message });
    }
  };

  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { orderStatus } = req.body;
      const requesterRole = req.user?.role;

      const updated = await this.orderService.updateOrderStatus(
        req.params.orderId,
        orderStatus,
        requesterRole,
      );

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  updatePaymentStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { paymentStatus } = req.body;

      const updated = await this.orderService.updatePaymentStatus(
        req.params.id,
        paymentStatus,
      );

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };

  cancelOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.user?._id;

      const consumer =
        await this.consumerProfileServices.getConsumerProfile(userId);

      const updated = await this.orderService.cancelOrder(
        req.params.id,
        consumer._id.toString(),
      );

      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, message: err.message });
    }
  };
}
