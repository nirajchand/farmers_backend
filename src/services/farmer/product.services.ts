import { CreateProductDto, UpdateProductDto } from "../../dtos/product.dto";
import { HttpError } from "../../errors/http-error";
import { FarmerProfileRepository } from "../../repositories/farmer.profile.respository";
import { ProductRepository } from "../../repositories/product.repository";

let productRepository = new ProductRepository();
let farmerProfileRepository = new FarmerProfileRepository();

export class ProductServices {
  async createProduct(productDto: CreateProductDto) {
    const userId = productDto.farmerId;

    const farmerProfile =
      await farmerProfileRepository.getFarmerProfile(userId);
    if (!farmerProfile) {
      throw new Error(
        "Farmer profile not found. Only registered farmers can add products.",
      );
    }

    const newProductData = {
      ...productDto,
      farmerId: farmerProfile._id,
    };

    const newProduct = await productRepository.createProduct(newProductData);
    if (!newProduct) {
      throw new HttpError(500, "Failed to add product");
    }

    return newProduct;
  }

  async updateProduct(productId: string, updatedProduct: UpdateProductDto) {
    const newProduct = await productRepository.updateProduct(
      productId,
      updatedProduct,
    );
    if (!newProduct) {
      throw new HttpError(500, "Product not found");
    }
    return newProduct;
  }

  async getproductById(productId: string) {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new HttpError(404, "Product not found");
    }
    return product;
  }

  async deleteProduct(productId: string) {
    const product = await productRepository.getProductById(productId);
    if (!product) {
      throw new HttpError(404, "product not found");
    }
    const result = await productRepository.deleteProduct(productId);
    return result;
  }

  async getProductsByFarmerId(userId: string) {
    const farmerProfile =
      await farmerProfileRepository.getFarmerProfile(userId);
    if (!farmerProfile) {
      throw new Error(
        "Farmer profile not found. Only registered farmers can add products.",
      );
    }

    const farmerId = farmerProfile._id.toString();
    const products = await productRepository.getProductsByFarmerId(farmerId);
    if (!products) {
      throw new HttpError(404, "No products added");
    }
    return products;
  }

  async getAllProducts(page?: string, size?: string, searchTerm?: string) {
    const currentPage = page ? parseInt(page) : 1;
    const pageSize = size ? parseInt(size) : 10;
    const currentSearch = searchTerm || "";

    const { products, total } = await productRepository.getAllProducts({
      page: currentPage,
      size: pageSize,
      searchTerm: currentSearch,
    });

    const pagination = {
      page: currentPage,
      size: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };

    return { products, pagination };
  }
}
