import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { AUTH_SERVICE } from '../constants/services';
import { ClientGrpc, ClientProxy } from '@nestjs/microservices';
import { catchError, map, tap } from 'rxjs/operators';
import { IUserDto } from '../dto';
import { AUTH_SERVICE_NAME, AuthServiceClient } from '../types';

@Injectable()
export class JwtAuthGuard implements CanActivate, OnModuleInit {
  private authService: AuthServiceClient;
  constructor(
    @Inject(AUTH_SERVICE_NAME) private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    this.authService =
      this.grpcClient.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const jwt =
      request.cookies?.Authentication || request.headers?.authentication;
    if (!jwt) {
      return false;
    }

    return this.authService.authenticate({ Authentication: jwt }).pipe(
      tap((res) => {
        context.switchToHttp().getRequest().user = {
          ...res,
          _id: res.id,
        };
      }),
      map(() => true),
      catchError(() => of(false)),
    );
  }
}
