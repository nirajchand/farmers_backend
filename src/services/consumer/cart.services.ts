import { CartRepository } from "../../repositories/cart.repository";
import { ConsumerProfileRepository } from "../../repositories/consumer.profile.respository";

let cartRepo = new CartRepository();
let consumerProfileRepository = new ConsumerProfileRepository();

export class CartService {
  async getUserCart(userId: string) {
    const consumer = await consumerProfileRepository.getProfile(userId);

    if (!consumer) {
      throw new Error("Consumer profile not found");
    }
    let cart = await cartRepo.getCartByUser(consumer._id.toString());
    if (!cart) {
      cart = await cartRepo.createCart(consumer._id.toString());
    }
    return cart;
  }

  async addToCart(userId: string, productId: string, quantity: number) {
    if (quantity < 1) {
      throw new Error("Quantity must be at least 1");
    }
    const consumer = await consumerProfileRepository.getProfile(userId);
    if (!consumer) {
      throw new Error("Consumer profile not found");
    }

    let cart = await cartRepo.getCartByUser(consumer._id.toString());

    if (!cart) {
      cart = await cartRepo.createCart(consumer._id.toString());
    }

    return await cartRepo.addItem(consumer._id.toString(), productId, quantity);
  }

  async removeFromCart(userId: string, cartItemId: string) {
    const consumer = await consumerProfileRepository.getProfile(userId);
    if (!consumer) {
      throw new Error("Consumer profile not found");
    }

    return cartRepo.removeItem(consumer._id.toString(), cartItemId);
  }

  async updateCartItem(userId: string, cartItemId: string, quantity: number) {
    if (quantity < 1) throw new Error("Quantity must be at least 1");
    const consumer = await consumerProfileRepository.getProfile(userId);
    if (!consumer) {
      throw new Error("Consumer profile not found");
    }

    return cartRepo.updateQuantity(consumer._id.toString(), cartItemId, quantity);
  }
}
