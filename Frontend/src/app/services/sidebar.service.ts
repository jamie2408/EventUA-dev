import { Injectable } from '@angular/core';
import { sidebarItem } from '../interfaces/sidebar.interface';
import { UsuarioService } from './usuario.service';
import { BrowserModule } from '@angular/platform-browser'

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menuAdmin: sidebarItem[] = [
    { titulo: 'Dashboard', icono: 'assessment', url: '/admin/dashboard'},
    { titulo: 'Usuarios', icono: 'supervisor_account', url: '/admin/usuarios'},
    { titulo: 'Notificaciones', icono: 'chat', url: '/admin/notificaciones'},
    { titulo: 'Lugares', icono: 'place', url: '/admin/lugares'},
    { titulo: 'Eventos', icono: 'calendar_today', url: '/admin/eventos'},
  ];
  menuAlumno: sidebarItem[] = [
    { titulo: 'Ajustes', icono: 'mdi mdi-settings', url: ''},
    { titulo: 'Mis eventos', icono: 'mdi mdi-home', url: '/usu/miseventos'},
    { titulo: 'Estadisticas', icono: 'mdi mdi-chart-bar', url: '/estadisticas'}
  ];

  constructor(private usuarioService: UsuarioService) { }

  getmenu( ){
    const rol = this.usuarioService.rol;

    switch (rol) {
      case 'ADMIN':
        return this.menuAdmin;
      default:
        return this.menuAlumno;

    }

    return [];
  }
}
