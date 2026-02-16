import { CreateProductDto, UpdateProductDto } from "../../dtos/product.dto";
import { HttpError } from "../../errors/http-error";
import { ProductRepository } from "../../repositories/product.repository";

let productRepository = new ProductRepository();

export class ProductServices {
  async createProduct(product: CreateProductDto) {
    const newProduct = await productRepository.createProduct(product);
    if (!newProduct) {
      throw new HttpError(500, "failed to add product");
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



  async getProductsByFarmerId(farmerId: string){
    const products = await productRepository.getProductsByFarmerId(farmerId);
    if(!products){
        throw new HttpError(404, "No products added")
    }
    return products;
  }
}
