import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/auth' },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'error', loadComponent: () => import('./shared/components/error/error.component').then(m => m.ErrorComponent) },
  { path: '**', redirectTo: '/error' }
];
