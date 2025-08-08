import { IoAdapter } from '@nestjs/platform-socket.io'
import { ServerOptions, Server } from 'socket.io'

export class WebscoketAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions) {
    const server: Server = super.createIOServer(3003, {
      ...options,
      cors: {
        origin: '*',
        credentials: true,
      },
    })
    return server
  }
}
