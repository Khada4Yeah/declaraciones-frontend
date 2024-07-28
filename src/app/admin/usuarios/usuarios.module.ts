import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';

import { TarjetasUsuariosComponent } from './components/tarjetas-usuarios/tarjetas-usuarios.component';
import { NzBadgeModule } from 'ng-zorro-antd/badge';



@NgModule({
  declarations: [TarjetasUsuariosComponent, ListaUsuariosComponent],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    NzBadgeModule
  ]
})
export class UsuariosModule { }
