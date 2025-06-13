import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');

  const config = new DocumentBuilder()
  .setTitle('Tourism management API.')
 .setDescription(`
    TOURISM MANAGEMENT API🦒
    An API for managing tourism data.

    This API provides comprehensive endpoints for managing:
    - 📝 User records and registration.
    - 🚌 Tour booking.
    - 👤 Admin, user and guest profile management.
    - ❓ Inquiries management.
    - ✅ User authentication and authorization.

    AUTHENTICATION.
  
    This API uses JWT Bearer tokens for authentication. To access protected endpoints:
  
    1. Login using the \`/auth/signin\` endpoint.
    2. Use the returned \`accessToken\` in the Authorization header.
    3. Format: \`Authorization: Bearer <your-token>\`.

    ROLES AND PERMISSIONS.
  
    - ADMIN: Full access to all resources.
    - USER: Limited access to own data and course information.
    - GUEST: Public access only.
    `)
  .setVersion('1.2')
  .addBearerAuth()
  .addTag('auth', 'Authentication endpoints.')
  .addTag('bookings', 'Booking endpoints.')
  .addTag('guest users', 'Guest users endpoints.')
  .addTag('inquiries', 'Inquiries endpoints.')
  .addTag('profiles', 'Profile management.')
  .addTag('tickets', 'Tickets endpoints.')
  .addTag('tour-packages', 'Tour packages endpoints.')
  .addTag('users', 'Users endpoints.')
  .addTag('admins', 'admin endpoints.')
  .addServer('http://localhost:3000', 'Development server')
  .addServer('https://api.tourism.com', 'Production server')
  .build();

  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    jsonDocumentUrl: 'api/api-json',
    yamlDocumentUrl: '/api-yaml',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
    customCss: `
    .swagger-ui .topbar { display: none;}
    .swagger-ui .info { margin-bottom: 20px; }
    .swagger-ui .topbar-wrapper img {
    content: url('tourism-management-system/src/icon/android-chrome-512x512.png');
    }
    `,
    customSiteTitle: 'Tourism Management API Documentation.'
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));


  await app.listen(3000);
  console.log('Server is running on port 3000');
}
bootstrap();
