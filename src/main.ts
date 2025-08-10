import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { WebscoketAdapter } from './websockets/websocket.adapter'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestJsSwagger } from 'nestjs-zod'
import helmet from 'helmet'
import { ConsoleLogger } from '@nestjs/common'
import { LoggingInterceptor } from './shared/interceptor/logging.interceptor'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new ConsoleLogger({}),
  })
  app.set('trust proxy', 'loopback')
  app.enableCors()
  app.use(helmet())
  app.useGlobalInterceptors(new LoggingInterceptor())
  patchNestJsSwagger()
  const config = new DocumentBuilder()
    .setTitle('Ecommerce API')
    .setDescription('The API for the ecommerce application')
    .setVersion('1.0')
    .addBearerAuth()
    .addApiKey(
      {
        name: 'authorization',
        type: 'apiKey',
      },
      'payment-api-key',
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })

  const websocketAdapter = new WebscoketAdapter(app)
  await websocketAdapter.connectToRedis()
  app.useWebSocketAdapter(websocketAdapter)
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
