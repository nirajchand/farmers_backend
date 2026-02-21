import { order } from "../types/oder";
import z from "zod";

export const placeOrderDto = order.pick({
    shippingAddress: true,
    paymentMethod:true,
    paymentStatus:true,
    orderStatus: true,
    deliveryFee:true
}) 

export type PlaceOrderDto = z.infer<typeof placeOrderDto>;
