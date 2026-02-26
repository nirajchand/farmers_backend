import mongoose from "mongoose";
import { OrderRepository } from "../../repositories/order.respository";
import { IOrder, IOrderItem } from "../../models/order.model";
import { CartRepository } from "../../repositories/cart.repository";
import { ProductRepository } from "../../repositories/product.repository"; // for fetching product info
import { ConsumerProfileServices } from "./consumer.profile.service";

interface PlaceOrderPayload {
  consumerId: string;
  shippingAddress: string;
  paymentMethod: "COD" | "Online";
  deliveryFee?: number;
}

export class OrderService {
  private orderRepo: OrderRepository;
  private cartRepo: CartRepository;
  private productRepo: ProductRepository;

  constructor() {
    this.orderRepo = new OrderRepository();
    this.cartRepo = new CartRepository();
    this.productRepo = new ProductRepository();
  }
  async placeOrder(payload: PlaceOrderPayload): Promise<IOrder> {
    const {
      consumerId,
      shippingAddress,
      paymentMethod,
      deliveryFee = 0,
    } = payload;

    // Get cart for this user
    const cart = await this.cartRepo.getCartByUser(consumerId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new Error("Cart is empty.");
    }

    // Build order items
    const orderItems: Omit<IOrderItem, "_id">[] = [];
    for (const item of cart.items) {
      const product = await this.productRepo.getProductById(
        item.productId._id.toString(),
      );
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const newQuantity = product.quantity - item.quantity;
      if (newQuantity < 0) {
        throw new Error(`Not enough stock for product ${product.productName}`);
      }

      // Pass the correct product._id here
      await this.productRepo.updateProductQuantity(
        product._id.toString(),
        newQuantity,
      );
      orderItems.push({
        productId: new mongoose.Types.ObjectId(product._id),
        farmerId: new mongoose.Types.ObjectId(product.farmerId),
        productName: product.productName,
        price: product.price,
        quantity: item.quantity,
        unitType: product.unitType,
        subtotal: parseFloat((product.price * item.quantity).toFixed(2)),
      });
    }

    // Calculate total amount
    const totalAmount = parseFloat(
      (
        orderItems.reduce((sum, i) => sum + i.subtotal, 0) + deliveryFee
      ).toFixed(2),
    );

    // Create order
    const order = await this.orderRepo.create({
      consumerId: new mongoose.Types.ObjectId(consumerId),
      items: orderItems as IOrderItem[],
      totalAmount,
      deliveryFee,
      shippingAddress,
      paymentMethod,
      orderStatus: "Pending",
      paymentStatus: "Pending",
    });

    // Clear the cart
    await this.cartRepo.clearCart(consumerId);

    return order;
  }

  async getOrderById(orderId: string): Promise<IOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found.");
    return order;
  }

  async getConsumerOrders(consumerId: string): Promise<IOrder[]> {
    const orders = await this.orderRepo.findByConsumer(consumerId);

    return orders.map((order) => {
      const obj = order.toObject();

      return {
        ...obj,
        paymentStatus:
          obj.orderStatus === "Delivered" ? "Paid" : obj.paymentStatus,
      };
    });
  }

  async getFarmerOrders(farmerId: string): Promise<IOrder[]> {
    const orders = await this.orderRepo.findByFarmer(farmerId);

    return orders.map((order) => {
      const obj = order.toObject();

      return {
        ...obj,
        paymentStatus:
          obj.orderStatus === "Delivered" ? "Paid" : obj.paymentStatus,
        items: obj.items.filter(
          (item: any) => item.farmerId.toString() === farmerId,
        ),
      };
    });
  }
  async getAllOrders(): Promise<IOrder[]> {
    return await this.orderRepo.findAll();
  }

  async updateOrderStatus(
    orderId: string,
    status: IOrder["orderStatus"],
    requesterRole: "farmer" | "consumer",
  ): Promise<IOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found.");

    if (requesterRole === "consumer") {
      if (status !== "Cancelled")
        throw new Error("Consumers can only cancel orders.");
      if (order.orderStatus !== "Pending")
        throw new Error("Only pending orders can be cancelled.");
    }

    if (requesterRole === "farmer") {
      const allowed: IOrder["orderStatus"][] = [
        "Accepted",
        "Shipped",
        "Cancelled",
        "Delivered",
      ];
      if (!allowed.includes(status))
        throw new Error("Farmers can only accept, ship, or cancel orders.");
    }

    const updated = await this.orderRepo.updateStatus(orderId, status);
    return updated!;
  }

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: IOrder["paymentStatus"],
  ): Promise<IOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found.");

    const updated = await this.orderRepo.updatePaymentStatus(
      orderId,
      paymentStatus,
    );
    return updated!;
  }

  async cancelOrder(orderId: string, consumerId: string): Promise<IOrder> {
    const order = await this.orderRepo.findById(orderId);
    if (!order) throw new Error("Order not found.");
    if (order.consumerId.toString() !== consumerId)
      throw new Error("Unauthorized.");
    if (order.orderStatus !== "Pending")
      throw new Error("Only pending orders can be cancelled.");

    const updated = await this.orderRepo.updateStatus(orderId, "Cancelled");
    return updated!;
  }
}
