import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // log res header
    // const request = context.switchToHttp().getRequest()
    // const response = context.switchToHttp().getResponse()
    // const now = Date.now()
    return next.handle().pipe(
      tap((data) => {
        this.logger.log({
          body: data,
        })
      }),
    )
  }
}
