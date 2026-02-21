import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  farmerId: mongoose.Types.ObjectId;
  productName: string;
  price: number;
  quantity: number;
  unitType: string;
  subtotal: number;
}

export interface IOrder extends Document {
  consumerId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  deliveryFee: number;
  orderStatus: "Pending" | "Accepted" | "Shipped" | "Delivered" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Failed";
  paymentMethod: "COD" | "Online";
  shippingAddress: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    consumerId: {
      type: Schema.Types.ObjectId,
      ref: "consumer_profiles",
      required: true,
    },

    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },

        farmerId: {
          type: Schema.Types.ObjectId,
          ref: "Users",
          required: true,
        },

        productName: String,
        price: Number, 
        quantity: Number,
        unitType: String,
        subtotal: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryFee: {
      type: Number,
      default: 0,
    },

    orderStatus: {
      type: String,
      enum: ["Pending", "Accepted", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },

    shippingAddress: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model<IOrder>("Orders", orderSchema);
