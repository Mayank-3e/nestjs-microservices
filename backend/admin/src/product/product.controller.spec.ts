import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ClientProxy } from '@nestjs/microservices';

describe('ProductController', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let productController: ProductController;
  let productService: ProductService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: 'root',
          database: 'admin',
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Product]),
      ],
      controllers: [ProductController],
      providers: [
        ProductService,
        {
          provide: 'PRODUCT_SERVICE',
          useValue: {
            emit: jest.fn()
          },
        },
      ]
    }).compile();
    app = module.createNestApplication();
    await app.init();
    
    client = module.get<ClientProxy>('PRODUCT_SERVICE');
    productController = module.get<ProductController>(ProductController);
    productService = app.get<ProductService>(ProductService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('gets products list', async() => {
    const response = await request(app.getHttpServer()).get('/products').expect(200)
    const products: Product[] = response.body
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
  });

  it('creates a product', async () => {
    const response = await request(app.getHttpServer()).post('/products')
      .send({ title: 'Test-product-title', image: 'Test-product-image url' })
      .expect(201);
    const product: Product = response.body
    expect(product).toBeDefined()
    expect(client.emit).toHaveBeenCalledTimes(1);
    expect(client.emit).toHaveBeenCalledWith('product_created',product);
    await productService.delete(product.id)
  });

  it('deletes a product', async () => {
    const product = await productService.create('Test-product-title','Test-product-image url');
    const response = await request(app.getHttpServer()).delete('/products/'+product.id)
      .expect(200);
    expect(client.emit).toHaveBeenCalledWith('product_deleted',product.id.toString());
  });
});