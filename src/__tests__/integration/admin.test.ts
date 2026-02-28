import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import path from "node:path";
import { FarmerProfileModel } from "../../models/farmer.profile.model";

describe("admin crud integration tests", () => {
  let adminToken: string;
  let tokenWithoutAdminUserType: string;
  let createdUserId: string;

  const adminDetails = {
    fullName: "admin",
    email: "admin@example.com",
    password: "admin123",
    confirmPassword: "admin123",
    role: "admin",
  };

  const testUser = {
    fullName: "Test",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    role: "farmer",
  };

  beforeAll(async () => {
    await UserModel.deleteMany({
      email: {
        $in: [
          adminDetails.email,
          testUser.email,
          "test1@example.com",
          "test2@example.com",
        ],
      },
    });
    
    // first register admin
    await request(app).post("/api/auth/register").send(adminDetails);
    await request(app).post("/api/auth/register").send(testUser);

    // secondly get token after login
    const response = await request(app).post("/api/auth/login").send({
      email: adminDetails.email,
      password: adminDetails.password,
    });

    const response2 = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });

    adminToken = response.body.token;
    tokenWithoutAdminUserType = response2.body.token;
  });

  afterAll(async () => {
    await UserModel.deleteMany({
      email: {
        $in: [
          "test1@example.com",
          "test2@example.com",
          adminDetails.email,
          testUser.email,
        ],
      },
    });
    await FarmerProfileModel.deleteMany({
      email: {
        $in: [
          "test1@example.com",
          "test2@example.com",
          adminDetails.email,
          testUser.email,
        ],
      },
    });
  });

  // ---------------------create user by admin -------------------------

  describe("POST /api/admin/users", () => {
    test("Should not create user without authtoken", async () => {
      const response = await request(app)
        .post("/api/admin/users")
        .field("fullName", testUser.fullName)
        .field("email", "test1@example.com")
        .field("password", testUser.password)
        .field("confirmPassword", testUser.confirmPassword)
        .field("role", testUser.role);
      expect(response.status).toBe(401);
    });

    test("Should not create user without admin usertype", async () => {
      const response = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${tokenWithoutAdminUserType}`)
        .field("fullName", testUser.fullName)
        .field("email", testUser.email)
        .field("password", testUser.password)
        .field("confirmPassword", testUser.confirmPassword)
        .field("role", testUser.role);
      expect(response.status).toBe(403);
    });

    test("Create user with admin Url", async () => {
      const response = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("fullName", testUser.fullName)
        .field("email", "test1@example.com")
        .field("password", testUser.password)
        .field("confirmPassword", testUser.confirmPassword)
        .field("role", testUser.role);
      expect(response.status).toBe(201);
    });

    test("create user with image send", async () => {
      const response = await request(app)
        .post("/api/admin/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .field("fullName", testUser.fullName)
        .field("email", "test2@example.com")
        .field("password", testUser.password)
        .field("confirmPassword", testUser.confirmPassword)
        .field("role", testUser.role)
        .attach(
          "profile_image",
          path.join(__dirname, "../images/test-image.jpg"),
        );
      expect(response.status).toBe(201);

      createdUserId = response.body.data._id;
    });
  });

  // ----------------------------------update user by admin -----------------------------
  describe("PUT /admin/users/:id", () => {
    test("should update user details", async () => {
      const res = await request(app)
        .put(`/api/admin/users/${createdUserId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .field("fullName", "Updated Name")
        .attach(
          "profile_image",
          path.join(__dirname, "../images/test-image.jpg"),
        );

      expect(res.status).toBe(200);
    });

    test("should fail if user id invalid", async () => {
      const res = await request(app)
        .put("/api/admin/users/invalid-id")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ fullName: "Test" });

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });

  // ----------------------------------delete user by admin ---------------------
  describe("DELETE /admin/users/:id", () => {
    test("should delete user successfully", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${createdUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
    });

    test("should return error if user already deleted", async () => {
      const res = await request(app)
        .delete(`/api/admin/users/${createdUserId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBeGreaterThanOrEqual(400);
    });
  });
});
