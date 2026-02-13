import request from "supertest";
import app from "../../app";
import { FarmerProfileModel } from "../../models/farmer.profile.model";
import { UserModel } from "../../models/user.model";
import path from "path";

describe("Farmer Profile Integration Tests", () => {
  const testUser = {
    fullName: "Farmer Test",
    email: "farmer@test.com",
    password: "password123",
    confirmPassword: "password123",
    role: "farmer",
  };

  let token: string;

  beforeAll(async () => {
    // Clean up previous test data
    await FarmerProfileModel.deleteMany({email: testUser.email});
    await UserModel.deleteMany({email: testUser.email});

    // Register the farmer user
    await request(app).post("/api/auth/register").send(testUser);
    const authUser = await UserModel.findOne({ email: testUser.email });



    // Login to get JWT token
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await FarmerProfileModel.deleteMany({ email: testUser.email });
    await UserModel.deleteMany({ email: testUser.email });
  });

  // ------------------------------ GET Profile Tests ----------------------------
  describe("GET /api/farmer/getProfile", () => {
    test("should return farmer profile when token is valid", async () => {
      const res = await request(app)
        .get("/api/farmer/getProfile")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.email).toBe(testUser.email);
    });

    test("should fail if token is missing", async () => {
      const res = await request(app).get("/api/farmer/getProfile");
      expect(res.status).toBe(401);
    });

    test("should fail if token is invalid", async () => {
      const res = await request(app)
        .get("/api/farmer/getProfile")
        .set("Authorization", "Bearer invalidtoken");

      expect(res.status).toBe(500);
    });
  });

  // ------------------------------ Update Profile Tests ------------------------
  describe("PUT /api/farmer/updateProfile", () => {
    test("should update farmer profile", async () => {
      const res = await request(app)
        .put("/api/farmer/updateProfile")
        .set("Authorization", `Bearer ${token}`)
        .field("fullName", "Updated Farmer");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should update profile with image upload", async () => {
      const res = await request(app)
        .put("/api/farmer/updateProfile")
        .set("Authorization", `Bearer ${token}`)
        .field("fullName", "Farmer With Image")
        .attach(
          "profile_image",
          path.join(__dirname, "../images/test-image.jpg"),
        );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    test("should not update profile without token", async () => {
      const res = await request(app)
        .put("/api/farmer/updateProfile")
        .field("fullName", "Fail Test");

      expect(res.status).toBe(401);
    });

    test("should fail with invalid data", async () => {
      const res = await request(app)
        .put("/api/farmer/updateProfile")
        .set("Authorization", `Bearer ${token}`)
        .field("email", "invalid-email-format");

      expect(res.status).toBe(400);
    });
  });
});
