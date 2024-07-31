import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpResponse<HttpInterceptorFn>) => {
      return throwError(() => error);
    }),
  );
};