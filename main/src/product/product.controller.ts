import { Controller, Get } from '@nestjs/common';
import { ProductService } from './product.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  all() {
    return this.productService.all()
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
