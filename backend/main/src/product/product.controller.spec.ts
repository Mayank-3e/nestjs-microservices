import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, INestMicroservice } from '@nestjs/common';
import * as request from 'supertest';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './product.model';
import { HttpModule } from '@nestjs/axios';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ClientProxy, ClientsModule, Transport } from '@nestjs/microservices';
import * as rxjs from 'rxjs';

describe('ProductController', () => {
  let app: INestApplication;
  let client: ClientProxy;
  let productController: ProductController;
  let productService: ProductService;
  let microservice: INestMicroservice;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost:27017/nest_main', { autoCreate: true }),
        MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}]),
        HttpModule
      ],
      controllers: [ProductController],
      providers: [ProductService]
    }).compile();
    app = module.createNestApplication();
    await app.init();

    microservice = module.createNestMicroservice({
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 4000, // Port for the microservice to listen on
      },
    });
    await microservice.listen();

    // Create the client for the microservice
    const clientModule: TestingModule = await Test.createTestingModule({
      imports: [
        ClientsModule.register([
          {
            name: 'TEST_CLIENT',
            transport: Transport.TCP,
            options: {
              host: '127.0.0.1',
              port: 4000,
            },
          },
        ]),
      ],
    }).compile();
    client = clientModule.get<ClientProxy>('TEST_CLIENT');
    await client.connect();
    productController = module.get<ProductController>(ProductController);
    productService = app.get<ProductService>(ProductService);
  });

  afterAll(async () => {
    await client.close(); // Close client connection
    await microservice.close(); // Shut down the microservice
    await app.close();
  });

  it('gets products list', async() => {
    const response = await request(app.getHttpServer()).get('/products').expect(200)
    const products: Product[] = response.body
    expect(Array.isArray(products)).toBe(true)
    expect(products.length).toBeGreaterThan(0)
  });

  it('should remove the product from the database', async () => {
    const product = await productService.create({
      id: 4899917,
      title: 'Test product',
      image: 'test-url',
      likes: 99
    });
    expect(product).toBeDefined()
    expect(product._id).toBeDefined()
    // Act: Simulate receiving the event
    await productController.productDeleted(product.id);
    const productFound = await productService.findOne(product.id);
    expect(productFound).toBeNull()
  });

  it('should listen for product_deleted events', async () => {
    const pid = Math.floor((Math.random()+5)*1e5)
    const product = await productService.create({
      id: pid,
      title: 'Test product',
      image: 'test-url',
      likes: 990
    });
    expect(product).toBeDefined()
    // Act: Emit an event using the ClientProxy
    await rxjs.lastValueFrom(client.emit<number>('product_deleted',pid));
    // wait for 2s
    const sleep = (delay: number) => new Promise(resolve => setTimeout(resolve, delay))
    await sleep(2e3);
    const productFound = await productService.findOne(pid);
    expect(productFound).toBeNull()
  });
});