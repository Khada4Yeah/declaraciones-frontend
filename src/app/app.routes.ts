import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth' },
  { path: 'auth', canActivate: [authGuard], loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', canActivate: [adminGuard], loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'error', loadComponent: () => import('./shared/components/error/error.component').then(m => m.ErrorComponent) },
  { path: '**', redirectTo: '/error' }
];
