import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { NestExpressApplication } from '@nestjs/platform-express'
import { WebscoketAdapter } from './websockets/websocket.adapter'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  app.enableCors()
  app.useWebSocketAdapter(new WebscoketAdapter(app))
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()
