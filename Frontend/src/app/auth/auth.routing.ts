import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecoveryComponent } from './recovery/recovery.component';
import { NoauthGuard } from '../guards/noauth.guard';
import { LandingComponent } from '../pages/usu/landing/landing.component';
import { ConfirmComponent } from './confirm/confirm.component';
import { ConfirmedComponent } from './confirmed/confirmed.component';
/*
/login               --> auth-layer/login
/register            --> auth-layer/register
/recovery            --> auth-layer/recovery
/dashboard           --> admin-layer/dashboard
/dashboard/usuarios  --> admin-layer/usurios
/dashboard           --> admin-layer/dashboard
/*                   --> auth-layer/login
*/

const routes: Routes = [
  { path: 'login', component: AuthLayoutComponent, canActivate: [ NoauthGuard],
  children: [
    { path: '', component: LoginComponent},
    //{ path: '**', redirectTo: ''}
  ]
  },
  { path: 'register', component: AuthLayoutComponent, canActivate: [ NoauthGuard],
  children: [
    { path: '', component: RegisterComponent},
    //{ path: '**', redirectTo: ''}
  ]
  },
  { path: 'recovery', component: AuthLayoutComponent, canActivate: [ NoauthGuard],
  children: [
    { path: '', component: RecoveryComponent},
    //{ path: '**', redirectTo: ''}
  ]
  },
  { path: 'confirmar', component: AuthLayoutComponent, canActivate: [ NoauthGuard],
  children: [
    { path: '', component: ConfirmComponent},
    //{ path: '**', redirectTo: ''}
  ]
  },
  { path: 'confirmed/:confirmationCode', component: AuthLayoutComponent, canActivate: [ NoauthGuard],
  children: [
    { path: '', component: ConfirmedComponent},
    //{ path: '**', redirectTo: ''}
  ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
