import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaUsuariosComponent } from './pages/lista-usuarios/lista-usuarios.component';
import { EditarUsuarioComponent } from './pages/editar-usuario/editar-usuario.component';
import { CrearUsuarioComponent } from './pages/crear-usuario/crear-usuario.component';

const routes: Routes = [
  { path: 'lista-usuarios', component: ListaUsuariosComponent, },
  { path: 'crear-usuario', component: CrearUsuarioComponent },
  { path: 'editar-usuario/:id', component: EditarUsuarioComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsuariosRoutingModule { }
