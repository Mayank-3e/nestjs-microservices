import { Injectable } from '@nestjs/common';
import { Product } from './product.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>
  ) {}

  async all(): Promise<Product[]> {
    return await this.productModel.find().exec()
  }

  async create(data: Product) {
    return new this.productModel(data).save()
  }

  async findOne(id: number): Promise<Product> {
    return await this.productModel.findOne({id})
  }

  async update(id: number, data): Promise<any> {
    return await this.productModel.findOneAndUpdate({id},data)
  }

  async delete(id: number): Promise<void> {
    await this.productModel.deleteOne({id})
  }
}
