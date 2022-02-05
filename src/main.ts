import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);

  const port = 3000;
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(port, () =>
    logger.log(`Server is ready... Listening on port ${port}`),
  );
}
bootstrap();
