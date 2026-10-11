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

  let headers = req.headers.set('Accept', 'application/json');
  if (accesToken) {
    headers = headers.set('Authorization', `Bearer ${accesToken}`);
  }

  const autRequest = req.clone({ headers });
  return next(autRequest);
};
