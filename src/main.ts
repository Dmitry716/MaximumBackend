import { NestFactory } from "@nestjs/core"
import { ValidationPipe } from "@nestjs/common"
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import helmet from "helmet"
import { ConfigService } from "@nestjs/config"
import * as express from 'express'
import { join } from "path"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix("api");
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  )
  
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  app.use(helmet())
  app.enableCors()

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle("Educational Platform API")
    .setDescription("API documentation for the Educational Platform backend")
    .setVersion("1.0")
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup("api/docs", app, document)

  // Get port from config
  const configService = app.get(ConfigService)
  const port = configService.get("PORT") || 3000

  await app.listen(port,'127.0.0.1')
  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()

