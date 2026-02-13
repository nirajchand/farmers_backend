import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/user.model";
import { ConsumerProfileModel } from "../../models/consumer.profile.model";

describe("Authentication Integration Tests", () => {
  // descibe test suite
  // what to run
  const testUser = {
    // according to your UserModel
    fullName: "Test",
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    role: "consumer",
  };

  afterAll(async () => {
    await UserModel.deleteMany({ email: testUser.email });
    await ConsumerProfileModel.deleteMany({ email: testUser.email });
  });

  // ------------------------------ Register Test ------------------------------------
  describe("POST /api/auth/register", () => {
    // nested describe block
    test(// actual test case
    "should register a new user", async () => {
      // test case description
      // test case implementation
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty(
        "message",
        "User registered successfully",
      );
    });

    test("should not register with same email", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send(testUser);
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty("message", "Email already in use");
    });

    test("should have same password and confirm password", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...testUser,
          confirmPassword: "wrongPassword",
        });

      expect(response.status).toBe(400);
    });

    test("should not register with empty data", async () => {
      const response = await request(app).post("/api/auth/register").send({});
      expect(response.status).toBe(400);
    });

    test("should fail with invalid email format", async () => {
      const response = await request(app)
        .post("/api/auth/register")
        .send({
          ...testUser,
          email: "invalid-email",
        });

      expect(response.status).toBe(400);
    });
  });

  // ----------------------Login Test-----------------------------------
  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      await UserModel.deleteMany({ email: testUser.email });
      await request(app).post("/api/auth/register").send(testUser);
    });

    test("Should login to registered user", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: testUser.password,
      });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Login Success");
      expect(response.body).toHaveProperty("token");
    });

    test("should not login with wrong credentails", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: "wrong@gmail.com",
        password: "123456",
      });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "User not Found");
    });

    test("should not login with wrong password", async () => {
      const response = await request(app).post("/api/auth/login").send({
        email: testUser.email,
        password: "wrongPassword",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Invalid Credentials");
    });
  });
});
