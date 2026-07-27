import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    })
  );

  const config = new DocumentBuilder()
    .setTitle('PNProject Portfolio Management API')
    .setDescription(
      'The API documentation for managing portfolios, investments, transactions, goals, and reports.'
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header'
      },
      'JWT-auth' // ชื่อ key อ้างอิงสำหรับใช้ตกแต่งใน Controller
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 3. เริ่มต้นสร้าง Endpoint /api-docs บนหน้าเว็บ
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT ?? 8000); // มั่นใจว่าเปิด Port 8000 หรือดึงจาก Env
}
bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Application failed to start', error);
  process.exit(1);
});
