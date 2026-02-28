import express, { Application, Request, Response } from "express";
import bodyParser from "body-parser";
import authRouter from "./routes/auth.routes";
import consumerProfileRouter from "./routes/consumer/consumer.profile.route";
import farmerProfileRouter from "./routes/farmer/farmer.profile.route";
import adminUserRoutes from "./routes/admin/admin.routes";
import productRoutes from "./routes/farmer/product.route";
import cartRoutes from "./routes/consumer/cart.route";
import orderProduct from "./routes/consumer/order.routes";
import farmerOrder from "./routes/farmer/order.route";
import cors from "cors";
import path from "path";

const app: Application = express();

app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.originalUrl);
  next();
});

let corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3002","https://farmers-mocha.vercel.app"],
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRouter);
app.use("/api/consumer", consumerProfileRouter);
app.use("/api/farmer", farmerProfileRouter);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/farmer/product", productRoutes);
app.use("/api/consumer/cart", cartRoutes);
app.use("/api/consumer/order", orderProduct);
app.use("/api/farmer/order", farmerOrder);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Welcome to API" });
});

export default app;
