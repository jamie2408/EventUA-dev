import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  usu = this.UsuarioService;
  imagenUrl = '';
  constructor( private UsuarioService: UsuarioService) { }

  ngOnInit(): void {
    this.UsuarioService.cargarUsuario(this.UsuarioService.uid)
      .subscribe( (res: any) => {
        this.imagenUrl = this.UsuarioService.imagenURL;
      });
  }

  logout(){
    this.UsuarioService.logout();
  }
}
