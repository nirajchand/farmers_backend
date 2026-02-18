import mongoose, { Schema } from "mongoose";
import { Product } from "../types/product";

export interface IProductModel extends Omit<Product, "farmerId">, Document {
  farmerId: mongoose.Types.ObjectId | string;
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema: Schema = new Schema<IProductModel>(
  {
    farmerId: {
      type: Schema.Types.ObjectId,
      ref: "Farmer_Profile",
      required: true,
    },

    productName: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    unitType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    description: {
      type: String,
      trim: true,
    },

    product_image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

export const ProductModel = mongoose.model<IProductModel>("Products", productSchema);
