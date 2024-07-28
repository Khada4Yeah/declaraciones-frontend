import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginUsuarioComponent } from './pages/login-usuario/login-usuario.component';

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginUsuarioComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }