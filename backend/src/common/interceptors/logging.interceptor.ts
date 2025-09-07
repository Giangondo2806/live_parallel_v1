import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, query, params } = request;
    const now = Date.now();

    // Log incoming request
    this.logger.log(`→ ${method} ${url}`, {
      body: this.sanitizeBody(body),
      query,
      params,
      timestamp: new Date().toISOString(),
    });

    return next.handle().pipe(
      tap({
        next: (response) => {
          const responseTime = Date.now() - now;
          this.logger.log(`← ${method} ${url} +${responseTime}ms`, {
            statusCode: 200,
            responseTime,
            timestamp: new Date().toISOString(),
          });
        },
        error: (error) => {
          const responseTime = Date.now() - now;
          this.logger.error(`← ${method} ${url} +${responseTime}ms [ERROR]`, {
            error: error.message,
            statusCode: error.status || 500,
            responseTime,
            timestamp: new Date().toISOString(),
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    // Remove sensitive information from logs
    const sensitiveFields = ['password', 'token', 'secret', 'key'];
    
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}
