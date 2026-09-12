import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';

import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { TarjetasUsuariosComponent } from './components/tarjetas-usuarios/tarjetas-usuarios.component';
import { DetalleUsuarioComponent } from './components/detalle-usuario/detalle-usuario.component';

import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { FormularioPersonaJuridicaComponent } from './components/formulario-persona-juridica/formulario-persona-juridica.component';
import { FormularioPersonaNaturalComponent } from './components/formulario-persona-natural/formulario-persona-natural.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { CrearUsuarioComponent } from './pages/crear-usuario/crear-usuario.component';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { ModalSubirArchivosComponent } from './components/modal-subir-archivos/modal-subir-archivos.component';
import { ModalVerArchivosComponent } from './components/modal-ver-archivos/modal-ver-archivos.component';

@NgModule({
  declarations: [
    TarjetasUsuariosComponent,
    DetalleUsuarioComponent,
    FormularioPersonaJuridicaComponent,
    FormularioPersonaNaturalComponent,
    ListaUsuariosComponent,
    CrearUsuarioComponent,
    EditarUsuarioComponent,
    ModalSubirArchivosComponent,
    ModalVerArchivosComponent
  ],
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    NzBadgeModule,
    NzIconModule,
    NzButtonModule,
    NzModalModule,
    NzSpinModule,
    NzFormModule,
    NzSelectModule,
    ReactiveFormsModule,
    FormsModule,
    NzInputModule,
    NzPopconfirmModule,
    NzEmptyModule,
    NzUploadModule,
    NzListModule,
    NzCheckboxModule,
    NzToolTipModule,
    NzTagModule
  ],
})
export class UsuariosModule { }
