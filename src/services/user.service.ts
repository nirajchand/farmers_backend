import jwt from "jsonwebtoken";
import { CreateUserDto, LoginUserDTO, UpdateUserDto } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";
import { UserRepository } from "../repositories/user.repository";
import bcrypt from "bcryptjs";
import { JWT_SECRET } from "../configs";
import { sendEmail } from "../configs/email";

let userRepository = new UserRepository();

export class UserService {
  async createuser(data: CreateUserDto) {
    // Check email exist or not
    const checkEmail = await userRepository.getUserByEmail(data.email);
    if (checkEmail) {
      throw new HttpError(403, "Email already in use");
    }

    // Hash password
    const hasedPassword = await bcrypt.hash(data.password, 10);
    data.password = hasedPassword;

    // createUser
    const newUser = userRepository.createUser(data);
    return newUser;
  }

  async loginUser(data: LoginUserDTO) {
    // check Email
    const user = await userRepository.getUserByEmail(data.email);
    if (!user) {
      throw new HttpError(404, "User not Found");
    }
    // compare password
    const validatePassword = await bcrypt.compare(data.password, user.password);
    if (!validatePassword) {
      throw new HttpError(401, "Invalid Credentials");
    }

    // Generate Jwt
    const payload = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });

    return { token, user };
  }

  async getUserById(id: string) {
    const user = userRepository.findUserById(id);
    if (!user) {
      throw new HttpError(404, "User not Found");
    }
    return user;
  }

  async updateUser(data: UpdateUserDto, userId: string) {
    const isUpdated = await userRepository.updateUser(userId, data);

    if (!isUpdated) {
      throw new HttpError(404, "no chnages made");
    }

    return {
      success: true,
      message: "User Updated",
      data: isUpdated,
    };
  }

  async sendResetPasswordEmail(email?: string) {
    const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
    if (!email) {
      throw new HttpError(400, "Email is required");
    }
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
    const html = `
  <p>You requested to reset your password.</p>

  <p><strong>Reset on Website:</strong><br/>
  <a href="${resetLink}">Click here to reset your password</a></p>

  <hr/>

  <p><strong>Reset in Mobile App:</strong></p>
  <p>Open the app and enter this reset token:</p>

  <p style="font-family: monospace; font-size: 16px;">
    <strong>${token}</strong>
  </p>

  <p>This token will expire in 1 hour.</p>
`;
    await sendEmail(user.email, "Password Reset", html);
    return user;
  }

  async resetPassword(token?: string, newPassword?: string) {
    try {
      if (!token || !newPassword) {
        throw new HttpError(400, "Token and new password are required");
      }
      const decoded: any = jwt.verify(token, JWT_SECRET);
      const userId = decoded.id;
      const user = await userRepository.findUserById(userId);
      if (!user) {
        throw new HttpError(404, "User not found");
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await userRepository.updateUser(userId, { password: hashedPassword });
      return user;
    } catch (error) {
      throw new HttpError(400, "Invalid or expired token");
    }
  }
}
