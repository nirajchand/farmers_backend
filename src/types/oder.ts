import z from "zod";

export const order = z.object({
    shippingAddress: z.string(),
    paymentMethod: z.enum(["COD","Online"]).default("COD"),
    orderStatus: z.enum(["Pending","Accepted","Shipped","Delivered","Cancelled"]).default("Pending"),
    paymentStatus: z.enum(["Pending", "Paid", "Failed"]).default("Pending"),
    deliveryFee:z.number().optional()
});



export type Order = z.infer<typeof order>;
