import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { ProductModel } from "../../models/product.model";
import path from "path";
import { ConsumerProfileModel } from "../../models/consumer.profile.model";
import { FarmerProfileModel } from "../../models/farmer.profile.model";

describe("Product functionality test", () => {
  let farmerToken: string;
  let farmerId: string;
  let productId: string;

  const testFarmer = {
    fullName: "Test Farmer",
    email: "farmer@example.com",
    password: "password123",
    confirmPassword: "password123",
    role: "farmer",
  };

  const testProduct = {
    productName: "Fresh Tomatoes",
    price: 50,
    quantity: 100,
    unitType: "kg",
    status: "Sold",
    description: "Freshly harvested tomatoes",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({ email: testFarmer.email });
    await FarmerProfileModel.deleteMany({email: testFarmer.email})

    await request(app).post("/api/auth/register").send(testFarmer);

    const loginRes = await request(app).post("/api/auth/login").send({
      email: testFarmer.email,
      password: testFarmer.password,
    });

    farmerToken = loginRes.body.token;
    farmerId = loginRes.body.user?._id || loginRes.body.data?._id;
  });

  afterAll(async () => {
    await UserModel.deleteMany({ email: testFarmer.email });
    await FarmerProfileModel.deleteMany({ email: testFarmer.email });
    await ProductModel.deleteMany({ productName: testProduct.productName });
  });


  describe("POST /api/farmer/product/addProduct", () => {
    test("should create a product successfully", async () => {
      const response = await request(app)
        .post("/api/farmer/product/addProduct")
        .set("Authorization", `Bearer ${farmerToken}`)
        .send({ ...testProduct, farmerId });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty("message", "Product Created");
      expect(response.body.data).toHaveProperty(
        "productName",
        testProduct.productName,
      );

      productId = response.body.data._id;
    });

    test("should fail to create product with missing required fields", async () => {
      const response = await request(app)
        .post("/api/farmer/product/addProduct")
        .set("Authorization", `Bearer ${farmerToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    test("should fail to create product without auth token", async () => {
      const response = await request(app)
        .post("/api/farmer/product/addProduct")
        .send({ ...testProduct, farmerId });

      expect(response.status).toBe(401);
    });
  });

  describe("GET /api/farmer/product", () => {

    describe("GET /api/product/farmer", () => {
      test("should fetch products for the authenticated farmer", async () => {
        const response = await request(app)
          .get("/api/farmer/product/farmerProducts")
          .set("Authorization", `Bearer ${farmerToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      test("should return 401 if not authenticated", async () => {
        const response = await request(app).get(
          "/api/farmer/product/farmerProducts",
        );

        expect(response.status).toBe(401);
      });
    });



    describe("put /api/farmer/product/:id", () => {
      test("should update a product successfully", async () => {
        const response = await request(app)
          .put(`/api/farmer/product/${productId}`)
          .set("Authorization", `Bearer ${farmerToken}`)
          .send({ price: 75, quantity: 200 });

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty("message", "product updated");
        // expect(response.body.data.price).toBe(75);
      });

      test("should fail to update with invalid data", async () => {
        const response = await request(app)
          .put(`/api/farmer/product/${productId}`)
          .set("Authorization", `Bearer ${farmerToken}`)
          .send({ price: "not-a-number" });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
      });

      test("should fail to update without auth token", async () => {
        const response = await request(app)
          .put(`/api/farmer/product/${productId}`)
          .send({ price: 100 });

        expect(response.status).toBe(401);
      });
    });


    describe("DELETE /api/farmer/product/:id", () => {
      test("should delete a product successfully", async () => {
        const response = await request(app)
          .delete(`/api/farmer/product/${productId}`)
          .set("Authorization", `Bearer ${farmerToken}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body).toHaveProperty("message", "Product Deleted");
      });

      test("should return 404 when deleting a non-existent product", async () => {
        const response = await request(app)
          .delete(`/api/farmer/product/${productId}`)
          .set("Authorization", `Bearer ${farmerToken}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body).toHaveProperty("message", "product not found");
      });

      test("should fail to delete without auth token", async () => {
        const response = await request(app).delete(
          `/api/farmer/product/${productId}`,
        );
        expect(response.status).toBe(401);
      });
    });
  });
});
