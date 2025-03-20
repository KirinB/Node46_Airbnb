import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { TokenCheck } from './modules/auth/token/token-check';
import { ResponseSuccessInterceptor } from './common/interceptor/reponse-success.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PermissionCheck } from './modules/auth/permission/permission-check';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalGuards(new TokenCheck(reflector));
  app.useGlobalGuards(new PermissionCheck(reflector));
  app.useGlobalInterceptors(new ResponseSuccessInterceptor(reflector));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Airbnb')
    .setDescription('The API airbnb description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
