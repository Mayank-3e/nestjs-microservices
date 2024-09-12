import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://pzskgxfx:QrnqlWEIUWDvkl1_VwryxrUgLDCTC1N8@prawn.rmq.cloudamqp.com/pzskgxfx'],
      queue: 'main_queue',
      queueOptions: {
        durable: false
      },
    },
  });

  app.listen()
}
bootstrap();
