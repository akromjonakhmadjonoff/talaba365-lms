import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module.js';
import { LangInterceptor } from './shared/interceptors/lang.interceptor.js';
import { NotFoundExceptionFilter } from './shared/filters/not-found.filter.js';
import { RequestContextMiddleware } from './shared/middleware/request-context.middleware.js';
import { TenantMiddleware } from './shared/middleware/tenant.middleware.js';

const PORT = process.env.PORT ?? 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new LangInterceptor());
  app.setGlobalPrefix('api/:version/:lang');
  app.use(new RequestContextMiddleware().use);
  app.use(new TenantMiddleware().use);

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('LMS API')
      .setBasePath('api/:version/:lang')
      .setDescription('API documentation')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/docs', app, document);
  }

  if (process.env.NODE_ENV !== 'production') {
    app.useGlobalFilters(new NotFoundExceptionFilter());
  }

  app.enableCors({
    origin: ['http://localhost:4000'],
    credentials: true,
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
  });

  await app.listen(PORT);
}

bootstrap().then(() => {
  console.log(`Server running at http://localhost:${PORT}`);
});
