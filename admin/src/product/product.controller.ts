import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  all() {
    return this.productService.all()
  }

  @Post()
  create(
    @Body('title') title: string,
    @Body('image') image: string
  ) {
    return this.productService.create(title,image)
  }

  @Get(':id')
  get(@Param('id') id: number) {
    return this.productService.get(id)
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body('title') title: string,
    @Body('image') image: string
  ) {
    return this.productService.update(id,title,image)
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.productService.delete(id)
  }
}
