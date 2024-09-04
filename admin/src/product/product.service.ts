import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>
  ) {}

  async all(): Promise<Product[]> {
    return await this.productRepo.find()
  }

  async create(title: string,image: string): Promise<Product> {
    return await this.productRepo.save({ title, image })
  }

  async get(id: number): Promise<Product> {
    return await this.productRepo.findOneBy({id})
  }

  async update(id: number,title: string,image: string) {
    return await this.productRepo.update(id, { title, image })
  }

  async delete(id: number) {
    return await this.productRepo.delete(id)
  }
}
