import { HttpContext, HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';


const CHECK_TOKEN = new HttpContextToken<boolean>(() => false);

export function checkToken() {
  return new HttpContext().set(CHECK_TOKEN, true);
}

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(CHECK_TOKEN)) {
    return next(req);
  }

  const token = inject(TokenService);

  const accesToken = token.obtenerToken();
  if (accesToken) {
    const autRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${accesToken}`)
    });
    return next(autRequest);
  }
  return next(req);
};
