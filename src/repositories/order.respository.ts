import { OrderModel, IOrder } from "../models/order.model";

export class OrderRepository {
  async create(data: Partial<IOrder>): Promise<IOrder> {
    const order = new OrderModel(data);
    return await order.save();
  }

  async findById(orderId: string): Promise<IOrder | null> {
    return await OrderModel.findById(orderId).populate(
      "consumerId",
      "fullName email",
    );
  }

  async findByConsumer(consumerId: string): Promise<IOrder[]> {
    return await OrderModel.find({ consumerId }).sort({ createdAt: -1 });
  }

  async findByFarmer(farmerId: string): Promise<IOrder[]> {
    return await OrderModel.find({ "items.farmerId": farmerId }).sort({
      createdAt: -1,
    }).populate("consumerId", "fullName email phoneNumber");
  }

  async findAll(filters: Record<string, unknown> = {}): Promise<IOrder[]> {
    return await OrderModel.find(filters).sort({ createdAt: -1 });
  }

  async updateStatus(
    orderId: string,
    orderStatus: IOrder["orderStatus"],
  ): Promise<IOrder | null> {
    return await OrderModel.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true },
    );
  }

  async updatePaymentStatus(
    orderId: string,
    paymentStatus: IOrder["paymentStatus"],
  ): Promise<IOrder | null> {
    return await OrderModel.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true },
    );
  }

  async delete(orderId: string): Promise<IOrder | null> {
    return await OrderModel.findByIdAndDelete(orderId);
  }
}
