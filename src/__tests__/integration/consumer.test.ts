import request from "supertest";
import app from "../../app";
import { ConsumerProfileModel } from "../../models/consumer.profile.model";
import path from "path";
import { UserModel } from "../../models/user.model";
import { FarmerProfileModel } from "../../models/farmer.profile.model";

describe("Consumer Profile Integration Tests", () => {
  const testUser = {
    fullName: "Consumer Test",
    email: "consumer@test.com",
    password: "password123",
    confirmPassword: "password123",
    role: "consumer",
  };

  let token: string;

  beforeAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
    await ConsumerProfileModel.deleteMany({ email: testUser.email });

    // Register user
    await request(app).post("/api/auth/register").send(testUser);
    const authUser = await UserModel.findOne({ email: testUser.email });

    // Login to get token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await ConsumerProfileModel.deleteMany({ email: testUser.email });
    await UserModel.deleteMany({ email: testUser.email });
  });


  // ------------------------------ GET Profile Tests ----------------------------
  describe("GET /api/consumer/getProfile", () => {
    test("should return consumer profile when token is valid", async () => {
      const res = await request(app)
        .get("/api/consumer/getProfile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    test("should fail if token is missing", async () => {
      const res = await request(app).get("/api/consumer/getProfile");
      expect(res.status).toBe(401);
    });

    test("should fail if token is invalid", async () => {
      const res = await request(app)
        .get("/api/consumer/getProfile")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(500);
    });
  });

  // ------------------------------ Update Profile Tests ------------------------
  describe("PUT /api/consumer/updateProfile", () => {
    test("should update consumer profile", async () => {
      const res = await request(app)
        .put("/api/consumer/updateProfile")
        .set("Authorization", `Bearer ${token}`)
        .field("fullName", "Updated Consumer");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should update profile with image upload", async () => {
      const res = await request(app)
        .put("/api/consumer/updateProfile")
        .set("Authorization", `Bearer ${token}`)
        .field("fullName", "Consumer With Image")
        .attach(
          "profile_image",
          path.join(__dirname, "../images/test-image.jpg"),
        );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should not update profile without token", async () => {
      const res = await request(app)
        .put("/api/consumer/updateProfile")
        .field("fullName", "Fail Test");

      expect(res.status).toBe(401);
    });

    test("should fail with invalid data", async () => {
      const res = await request(app)
        .put("/api/consumer/updateProfile")
        .set("Authorization", `Bearer ${token}`)
        .field("email", "invalid-email-format");

      expect(res.status).toBe(400);
    });

    test("should fail when no update fields are provided", async () => {
      const res = await request(app)
        .put("/api/consumer/updateProfile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });
});
