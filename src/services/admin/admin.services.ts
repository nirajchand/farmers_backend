import bcrypt from "bcryptjs";
import { CreateUserDto, UpdateUserDto } from "../../dtos/user.dto";
import { HttpError } from "../../errors/http-error";
import { UserRepository } from "../../repositories/user.repository";

let userRepository = new UserRepository();
export class AdminServices {
  async createUser(data: CreateUserDto) {
    const checkEmail = await userRepository.getUserByEmail(data.email);
    if (checkEmail) {
      throw new HttpError(404, "Email already exist");
    }
    const hasedPassword = await bcrypt.hash(data.password, 10);
    data.password = hasedPassword;

    const newUser = userRepository.createUser(data);
    return newUser;
  }

  async getAllUsers() {
    const users = await userRepository.getAllUsers();
    return users;
  }

  async deleteUser(id: string) {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    const deleted = await userRepository.deleteUser(id);

    return deleted;
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    const user = await userRepository.findUserById(userId);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    if (data.password) {
      data.password = await bcrypt.hash(data.password as string, 10);
    }
    const isUpdated = await userRepository.updateUser(userId, data);
    if (!isUpdated) {1
      throw new HttpError(404, "no chnages made");
    }
    return {
      success: true,
      message: "User Updated",
      data: isUpdated,
    };
  }

  async getUserById(id: string) {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }
}
