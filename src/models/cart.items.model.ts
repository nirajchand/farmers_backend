import mongoose, { Schema, Document,Types } from "mongoose";

export interface ICartItem {
  _id?: Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface ICartModel extends Document {
  consumerId: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema: Schema = new Schema<ICartModel>(
  {
    consumerId: {
      type: Schema.Types.ObjectId,
      ref: "consumer_profiles",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

export const CartModel = mongoose.model<ICartModel>("Carts", cartSchema);
