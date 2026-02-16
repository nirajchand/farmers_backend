import z from "zod";

export const product = z.object({
  farmerId: z.string(),
  productName: z.string().trim().min(1, "Product name is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  unitType: z.enum(["kg", "piece", "litre", "dozen"]),
  quantity: z.coerce.number().nonnegative("Quantity cannot be negative"),
  description: z.string().trim(),
  product_image: z.string().url("Invalid image URL").optional(),
});

export type ProductType = z.infer<typeof product>;
