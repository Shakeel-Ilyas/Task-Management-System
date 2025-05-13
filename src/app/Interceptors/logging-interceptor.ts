import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  console.log('Logging Interceptor called!');
  console.log('Request sent to URL: ' + req.url);
  return next(req);
};
