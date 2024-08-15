import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';
import { TokenService } from '../services/token.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);


  const isValidToken = tokenService.tokenValido();

  if (isValidToken) {
    router.navigate(['/admin']);
    return false;
  }
  return true;
};
