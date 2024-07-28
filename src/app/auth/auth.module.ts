import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';

import { LoginUsuarioComponent } from './pages/login-usuario/login-usuario.component';
import { FormularioLoginComponent } from './components/formulario-login/formulario-login.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';

@NgModule({
  declarations: [FormularioLoginComponent, LoginUsuarioComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzFormModule,
    NzSpinModule,
    NzInputModule,
    NzIconModule,
    NzModalModule
  ]
})
export class AuthModule { }
