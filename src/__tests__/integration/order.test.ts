import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { ConsumerProfileModel } from "../../models/consumer.profile.model";
import { OrderModel } from "../../models/order.model";

describe("Order functionality test", () => {
  let consumerToken: string;
  let farmerToken: string;
  let orderId: string;

  const testConsumer = {
    fullName: "Test Consumer",
    email: "consumerorder@example.com",
    password: "password123",
    confirmPassword: "password123",
    role: "consumer",
  };

  const validOrderPayload = {
    shippingAddress: "123 Test Street, Kathmandu",
    paymentMethod: "COD",
    deliveryFee: 50,
  };

  beforeAll(async () => {
    // Clean up
    await UserModel.deleteMany({
      email: testConsumer.email,
    });
    await ConsumerProfileModel.deleteMany({
      email: testConsumer.email,
    });

    // Register & login consumer
    await request(app).post("/api/auth/register").send(testConsumer);
    const consumerLogin = await request(app).post("/api/auth/login").send({
      email: testConsumer.email,
      password: testConsumer.password,
    });
    consumerToken = consumerLogin.body.token;
  });

  afterAll(async () => {
    await UserModel.deleteMany({
      email: testConsumer.email,
    });
    await ConsumerProfileModel.deleteMany({
      email: testConsumer.email,
    });
    await OrderModel.deleteMany({
      shippingAddress: validOrderPayload.shippingAddress,
    });
  });

  describe("POST /api/consumer/order/placeOrder", () => {
    test("should fail to place order when cart is empty", async () => {
      const response = await request(app)
        .post("/api/consumer/order/placeOrder")
        .set("Authorization", `Bearer ${consumerToken}`)
        .send(validOrderPayload);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Cart is empty.");
    });



    test("should fail to place order without shippingAddress", async () => {
      const response = await request(app)
        .post("/api/consumer/order/placeOrder")
        .set("Authorization", `Bearer ${consumerToken}`)
        .send({ paymentMethod: "COD" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body).toHaveProperty("message");
    });

    test("should fail to place order with invalid paymentMethod", async () => {
      const response = await request(app)
        .post("/api/consumer/order/placeOrder")
        .set("Authorization", `Bearer ${consumerToken}`)
        .send({ ...validOrderPayload, paymentMethod: "Crypto" });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should fail to place order with empty body", async () => {
      const response = await request(app)
        .post("/api/consumer/order/placeOrder")
        .set("Authorization", `Bearer ${consumerToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should return 401 when placing order without auth token", async () => {
      const response = await request(app)
        .post("/api/consumer/order/placeOrder")
        .send(validOrderPayload);

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/consumer/order/my", () => {
    test("should fetch consumer's own orders", async () => {
      const response = await request(app)
        .get("/api/consumer/order/my")
        .set("Authorization", `Bearer ${consumerToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test("should return 401 when fetching orders without auth token", async () => {
      const response = await request(app).get("/api/consumer/order/my");

      expect(response.status).toBe(401);
    });
  });
});
