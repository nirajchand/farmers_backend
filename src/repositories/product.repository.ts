import { IProductModel, ProductModel } from "../models/product.model";

export interface IProduct {
  createProduct(productData: Partial<IProductModel>): Promise<IProductModel>;
  getProductById(productId: string): Promise<IProductModel | null>;
  getAllProducts(): Promise<IProductModel[]>;
  updateProduct(
    productId: string,
    updatedData: Partial<IProductModel>,
  ): Promise<boolean>;
  deleteProduct(productId: string): Promise<boolean>;
  getProductsByFarmerId(farmerId: string): Promise<IProductModel[]>;
}

export class ProductRepository implements IProduct {
  async createProduct(
    productData: Partial<IProductModel>,
  ): Promise<IProductModel> {
    const product = await ProductModel.create(productData);
    return product;
  }
  async getProductById(productId: string): Promise<IProductModel | null> {
    const product = await ProductModel.findById(productId);
    return product;
  }
  async getAllProducts(): Promise<IProductModel[]> {
    throw new Error("Method not implemented.");
  }

  async updateProduct(
    productId: string,
    updatedData: Partial<IProductModel>,
  ): Promise<boolean> {
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true },
    );
    return product ? true : false;
  }

  async deleteProduct(productId: string): Promise<boolean> {
    const result = await ProductModel.findByIdAndDelete(productId);
    return result ? true : false;
  }

  async getProductsByFarmerId(farmerId: string): Promise<IProductModel[]> {
    return await ProductModel.find({ farmerId });
  }
}
