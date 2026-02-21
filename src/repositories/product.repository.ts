import { QueryFilter } from "mongoose";
import { IProductModel, ProductModel } from "../models/product.model";

export interface IProduct {
  createProduct(productData: Partial<IProductModel>): Promise<IProductModel>;
  getProductById(productId: string): Promise<IProductModel | null>;
  getAllProducts({
    page,
    size,
    searchTerm,
  }: {
    page: number;
    size: number;
    searchTerm?: string;
  }): Promise<{ products: IProductModel[]; total: number }>;
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
    const product = await ProductModel.findById(productId).populate("farmerId","_id farmName farmLocation phoneNumber description");
    return product;
  }

  async getAllProducts({
    page,
    size,
    searchTerm,
  }: {
    page: number;
    size: number;
    searchTerm?: string;
  }): Promise<{ products: IProductModel[]; total: number }> {
    let filter: QueryFilter<IProductModel> = {}

    if(searchTerm){
      filter = {productName: {$regex: searchTerm, options: "i"}}
    }

    const [products, total] = await Promise.all([
      ProductModel.find(filter)
        .skip((page-1)*size)
        .limit(size).populate("farmerId","_id farmName farmLocation phoneNumber description"),
      ProductModel.countDocuments(filter)
    ])

    return {products,total};

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
