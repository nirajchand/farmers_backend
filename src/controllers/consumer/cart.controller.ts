import { Request, Response } from "express";
import { CartService } from "../../services/consumer/cart.services";

  let cartService = new CartService();

export class CartController {

  async getCart(req: Request, res: Response) {
    const userId = req.user?._id;
    const cart = await cartService.getUserCart(userId);
    res.json(cart);
  }

  async addItem(req: Request, res: Response) {
    const userId = req.user?._id;
    console.log("here is get body", req.body)
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    res.json(cart);
  }

  async removeItem(req: Request, res: Response) {
    const userId = req.user?._id;
    const { cartItemId } = req.params;
    const cart = await cartService.removeFromCart(userId, cartItemId);
    res.json(cart);
  }

  async updateItem(req: Request, res: Response) {
    const userId = req.user?._id;
    const { cartItemId, quantity } = req.body;
    const cart = await cartService.updateCartItem(
      userId,
      cartItemId,
      quantity,
    );
    res.json(cart);
  }
}
