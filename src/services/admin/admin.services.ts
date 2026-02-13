import bcrypt from "bcryptjs";
import { CreateUserDto, UpdateUserDto } from "../../dtos/user.dto";
import { HttpError } from "../../errors/http-error";
import { UserRepository } from "../../repositories/user.repository";
import { ConsumerProfileRepository } from "../../repositories/consumer.profile.respository";
import { FarmerProfileRepository } from "../../repositories/farmer.profile.respository";

let userRepository = new UserRepository();
let consumerRepository = new ConsumerProfileRepository();
let farmerRepository = new FarmerProfileRepository();
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

  async getAllUsers({ page, size }: { page?: string; size?: string }) {
    const currentPage = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;
    const { users, total } = await userRepository.getAllUsers({
      page: currentPage,
      size: pageSize,
    });

    const pagination = {
      page: currentPage,
      size: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
    return { users, pagination };
  }

  async deleteUser(id: string) {
    const user = await userRepository.findUserById(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    if (user.role === "consumer") {
      await consumerRepository.deleteUser(id);
    }
    if (user.role === "farmer") {
      await farmerRepository.deleteUser(id);
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
    if (!isUpdated) {
      1;
      throw new HttpError(404, "no chnages made");
    }
    return {
      success: true,
      message: "User Updated",
      data: isUpdated,
    };
  }

  async getConsumerById(id: string) {
    const user = await consumerRepository.getProfile(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }
  async getFarmerById(id: string) {
    const user = await farmerRepository.getFarmerProfile(id);
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    return user;
  }
}
