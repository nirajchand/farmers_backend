import {
  CreateProductDto,
  createProductDto,
  UpdateProductDto,
  updateProductDto,
} from "../../dtos/product.dto";
import { CreateUserDto } from "../../dtos/user.dto";
import { HttpError } from "../../errors/http-error";
import { ProductServices } from "../../services/farmer/product.services";
import { Request, Response } from "express";

let productServices = new ProductServices();

interface QueryParams {
  page?: string;
  size?: string;
  search?: string;
}

export class ProductController {
  async createProduct(req: Request, res: Response) {
    try {
      const parseData = createProductDto.safeParse(req.body);
      if (!parseData.success) {
        return res.status(400).json({
          success: false,
          message: parseData.error.format(),
        });
      }

      if (req.file) {
        parseData.data.product_image = `/uploads/${req.file.filename}`;
      }

      const productData: CreateProductDto = parseData.data;
      const product = await productServices.createProduct(productData);

      return res
        .status(201)
        .json({ success: true, message: "Product Created", data: product });
    } catch (err: Error | any) {
      return res.status(err.statusCode || 501).json({
        success: false,
        message: err.message || "failed to create product",
      });
    }
  }

  async updateProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const parseData = updateProductDto.safeParse(req.body);
      if (!parseData.success) {
        return res.status(400).json({
          success: false,
          message: parseData.error.format(),
        });
      }

      if (req.file) {
        parseData.data.product_image = `/uploads/${req.file.filename}`;
      }

      const updatedProduct: UpdateProductDto = parseData.data;
      const product = await productServices.updateProduct(
        productId,
        updatedProduct,
      );
      return res
        .status(200)
        .json({ success: true, message: "product updated", data: product });
    } catch (err: Error | any) {
      return res.status(err.statusCode || 501).json({
        success: true,
        message: err.message || "Internal server Error",
      });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const deleted = await productServices.deleteProduct(productId);
      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "product not found" });
      }
      return res
        .status(200)
        .json({ success: true, message: "Product Deleted" });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const user = await productServices.getproductById(productId);

      return res
        .status(200)
        .json({ success: true, data: user, message: "Product Retrieved" });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getProductsByFarmerId(req: Request, res: Response) {
    try {
      const farmerId = req.user?._id;
      const user = await productServices.getProductsByFarmerId(farmerId);

      return res
        .status(200)
        .json({ success: true, data: user, message: "Products Retrieved" });
    } catch (error: Error | any) {
      return res.status(error.statusCode ?? 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const { page, size, search }: QueryParams = req.query;

      const { products, pagination } = await productServices.getAllProducts(
        page,
        size,
        search,
      );
      return res.status(200).json({
        success: true,
        data: products,
        pagination,
        message: "Products fetched successfully",
      });
    } catch (err: Error | any) {
      return res
        .status(err.statusCode || 500)
        .json({ message: err.message || "Internal Server Error" });
    }
  }
}
