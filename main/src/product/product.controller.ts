import { Controller, Get, Param, Post } from '@nestjs/common';
import { ProductService } from './product.service';
import { EventPattern } from '@nestjs/microservices';
import { HttpService } from '@nestjs/axios';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private httpService: HttpService
  ) {}

  @Get()
  all() {
    return this.productService.all()
  }

  @Post(':id/like')
  async like(@Param('id') id: number) {
    const product = await this.productService.findOne(id);
    this.httpService.post(`http://localhost:8000/api/products/${id}/like`,{}).subscribe(res => {
      console.log(res);
    });
    return this.productService.update(id, {
      likes: product.likes + 1
    })
  }

  @EventPattern('product_created')
  async productCreated(product) {
    await this.productService.create({
      id: product.id,
      title: product.title,
      image: product.image,
      likes: product.likes
    })
  }

  @EventPattern('product_updated')
  async productUpdated(product) {
    await this.productService.update(product.id, {
      id: product.id,
      title: product.title,
      image: product.image,
      likes: product.likes
    })
  }

  @EventPattern('product_deleted')
  async productDeleted(id: number) {
    await this.productService.delete(id)
  }
}
