import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler, // Observable<any>
  ): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const now = Date.now();
    if (req) {
      const method = req.method;
      const url = req.url;

      return next
        .handle()
        .pipe(
          tap(() =>
            this.logger.log(
              `${method} ${url} ${Date.now() - now}ms`,
              context.getClass().name,
            ),
          ),
        );
    }
  }
}
