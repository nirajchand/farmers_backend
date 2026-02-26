import mongoose from "mongoose";
import { CartModel, ICartModel } from "../models/cart.items.model";

export class CartRepository {
  async getCartByUser(consumerId: string): Promise<ICartModel | null> {
    return CartModel.findOne({ consumerId }).populate("items.productId");
  }
  async createCart(consumerId: string): Promise<ICartModel> {
    return CartModel.create({ consumerId, items: [] });
  }

  async addItem(
    consumerId: string,
    productId: string,
    quantity: number,
  ): Promise<ICartModel> {
    const cart = await CartModel.findOne({ consumerId });
    if (!cart) throw new Error("Cart not found");

    const existingItem = cart.items.find(
      (i) => i.productId.toString() === productId,
    );
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId: new mongoose.Types.ObjectId(productId),
        quantity,
      });
    }
    return cart.save();
  }



  
  async removeItem(
    consumerId: string,
    cartItemId: string,
  ): Promise<ICartModel> {
    const cart = await CartModel.findOne({ consumerId });
    if (!cart) throw new Error("Cart not found");

    cart.items = cart.items.filter((i) => i._id!.toString() !== cartItemId);

    return cart.save();
  }

  async updateQuantity(
    consumerId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<ICartModel> {
    const cart = await CartModel.findOne({ consumerId });
    if (!cart) throw new Error("Cart not found");

    const item = cart.items.find((i) => i._id!.toString() === cartItemId);
    if (!item) throw new Error("Product not in cart");

    item.quantity = quantity;
    const savedCart = await cart.save();
    await savedCart.populate("items.productId");
    return savedCart;
  }

  async clearCart(consumerId: string): Promise<ICartModel> {
    const cart = await CartModel.findOne({ consumerId });
    if (!cart) throw new Error("Cart not found");

    cart.items = []; // remove all items
    return cart.save();
  }
}
