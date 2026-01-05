import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authorizedMiddleware } from "../middlewares/auth.middleware";

let authcontroller = new AuthController()
const router = Router();

router.post("/register",authcontroller.registerUser);
router.post("/login",authcontroller.loginUser);

export default router;