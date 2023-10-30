import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';

/*
/login               --> auth-layer/login
/recovery            --> auth-layer/recovery
/dashboard           --> admin-layer/dashboard
/dashboard/usuarios  --> admin-layer/usurios
/dashboard           --> admin-layer/dashboard
/*                   --> auth-layer/login
*/

const routes: Routes = [
  // /login y /recovery --> AuhtRoutingModule
  // /dashboard y /index--> PagesRoutingModule
  { path: '**', redirectTo: 'landing'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  AuthRoutingModule,
  PagesRoutingModule
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
