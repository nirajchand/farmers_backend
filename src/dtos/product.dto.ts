import { product } from "../types/product";
import z from "zod";


export const createProductDto = product.pick({
    farmerId: true,
    productName: true,
    price: true,
    quantity: true,
    unitType: true,
    status: true,
    description: true,
    product_image: true,
})

export type CreateProductDto = z.infer<typeof createProductDto>

export const updateProductDto = product.omit({farmerId: true}).partial();
export type UpdateProductDto = z.infer<typeof updateProductDto>

