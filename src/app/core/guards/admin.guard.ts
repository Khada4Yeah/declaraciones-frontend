import { CanActivateFn, Router } from '@angular/router';

import { inject } from '@angular/core';

import { NzModalService } from 'ng-zorro-antd/modal';
import { TokenService } from '../services/token.service';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const adminGuard: CanActivateFn = (route, state) => {
  const tokenService = inject(TokenService);
  const router = inject(Router);
  const modal = inject(NzModalService);

  const isValidToken = tokenService.tokenValido();

  if (!isValidToken) {
    modal.info({
      nzTitle: 'Sesión Expirada',
      nzContent: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      nzOnOk: () => {
        router.navigate(['auth', 'login']);
      }
    });

    return false;
  }

  return true;
};