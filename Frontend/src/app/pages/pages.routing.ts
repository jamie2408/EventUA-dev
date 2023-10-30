import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../guards/auth.guard';
import { NoauthGuard } from '../guards/noauth.guard';
import { AdminLayoutComponent } from '../layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from '../layouts/user-layout/user-layout.component';
import { IndexLayoutComponent } from '../layouts/index-layout/index-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { IndexComponent } from './index/index.component';
import { UsuariosComponent } from './admin/usuarios/usuarios.component';
import { PerfilComponent } from './perfil/perfil.component';
import { EventosComponent } from './admin/eventos/eventos.component';
import { UsuarioComponent } from './admin/usuario/usuario.component';
import { EventoComponent } from './admin/evento/evento.component';
import { LugaresComponent } from './admin/lugares/lugares.component';
import { LugarComponent } from './admin/lugar/lugar.component';
import { NotificacionesComponent} from './admin/notificaciones/notificaciones.component';
import { NotificacionComponent} from './admin/notificacion/notificacion.component';
import { DocsComponent } from './admin/docs/docs.component'
import { LandingComponent } from './usu/landing/landing.component';
import { MiseventosComponent } from './usu/miseventos/miseventos.component';
import { MieventoComponent } from './usu/mievento/mievento.component';
import { EstadisticasComponent } from './usu/estadisticas/estadisticas.component';

/*
AQUI AÑADIMOS LAS RUTAS Y INDICANMOS EL ROL QUE PUEDE ACCEDER
/index               --> user-layout/index
/swagger             --> /docs
/login               --> auth-layer/login
/recovery            --> auth-layer/recovery
/dashboard           --> admin-layer/dashboard
/dashboard/usuarios  --> admin-layer/usuarios
/dashboard           --> admin-layer/dashboard
/dashboard/eventos   --> admin-layer/eventos
/*                   --> auth-layer/login
*/

const routes: Routes = [
  { path: 'landing', component: LandingComponent, canActivate: [ NoauthGuard ], data: {rol: '*'},
  children: [
    { path: '', component: IndexComponent, data: {
                                  titulo: 'Landing'
                                   },}
  ]}
  ,
  { path: 'estadisticas', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: '*'},
    children: [
      { path: '', component: EstadisticasComponent, data: {
                                    titulo: 'Tus estadísticas en EventUA',
                                    breadcrums: []
                                  },},
  ]}
  ,
  { path: 'home', component: IndexLayoutComponent, canActivate: [ AuthGuard ], data: {rol: '*'},
    children: [
      { path: '', component: IndexComponent, data: {
                                    titulo: 'Index'
                                     },},
      { path: 'evento/:id', component: IndexComponent, data: {
                                    titulo: 'Index'
                                     },},                               
  ]}
  ,
  { path: 'perfil', component: AdminLayoutComponent, canActivate: [ AuthGuard ], data: {rol: '*'},
    children: [
      { path: '', component: PerfilComponent, data: {
                                    titulo: 'Perfil',
                                    breadcrums: []
                                  },},
    ]},

  { path: 'admin', component: AdminLayoutComponent, canActivate: [ AuthGuard], data: {rol: 'ADMIN'},
    children: [
    { path: 'docs', component: DocsComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: '',
                                                        breadcrums: []
                                                      },},
    { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Dashboard',
                                                        breadcrums: []
                                                      },},
    { path: 'usuarios', component: UsuariosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Usuarios',
                                                        breadcrums: [ ],
                                                      },},
    { path: 'usuarios/usuario/:uid', component: UsuarioComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Usuario',
                                                        breadcrums: [ {titulo: 'Usuarios', url: '/admin/usuarios'} ],
                                                      },},
    { path: 'eventos', component: EventosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Eventos',
                                                        breadcrums: [ ],
                                                      },},
      { path: 'eventos/evento/:uid', component: EventoComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Evento',
                                                        breadcrums: [ {titulo: 'Eventos', url: '/admin/eventos'} ],
                                                      },},
      { path: 'notificaciones', component: NotificacionesComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Notificaciones',
                                                        breadcrums: [ ],
                                                      },},
      { path: 'notificaciones/notificacion/:uid', component: NotificacionComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Notificacion',
                                                        breadcrums: [ {titulo: 'Notificaciones', url: '/admin/notificaciones'} ],
                                                      },},
      { path: 'lugares', component: LugaresComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Lugares',
                                                        breadcrums: [ ],
                                                      },},
      { path: 'lugares/lugar/:uid', component: LugarComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'ADMIN',
                                                        titulo: 'Lugares',
                                                        breadcrums: [ {titulo: 'Lugares', url: '/admin/lugares'} ],
                                                      },},

    { path: '**', redirectTo: 'dashboard'}
  ]},

  { path: 'usu', component: AdminLayoutComponent, canActivate: [ AuthGuard], data: {rol: 'USUARIO'},
    children: [
    { path: 'miseventos', component: MiseventosComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'USUARIO',
                                                        titulo: '',
                                                        breadcrums: []
                                                      },},
    { path: 'miseventos/mievento/:uid', component: MieventoComponent, canActivate: [ AuthGuard ], data: {
                                                        rol: 'USUARIO',
                                                        titulo: 'Editar evento',
                                                        breadcrums: [ {titulo: 'MisEventos', url: '/usu/miseventos'} ],
                                                      },},



    { path: '**', redirectTo: 'dashboard'}
  ]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
