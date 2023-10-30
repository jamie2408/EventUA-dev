import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private UsuarioService: UsuarioService,
               private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.UsuarioService.validarToken()
        .pipe(
          tap( resp => {
            if (!resp){
              this.router.navigateByUrl('/landing');
            } else {
              // Si la ruta no es para el rol del token, reenviamos a ruta base de rol del token
              if ((route.data.rol !== '*') && (this.UsuarioService.rol !== route.data.rol)) {
                if(this.UsuarioService.rol === "ADMIN") {
                    this.router.navigateByUrl('/admin/dashboard');
                } else {
                  //  Ruta de usuario
                    this.router.navigateByUrl('/home');
                }

             }
            }
          })
        );
  }

}
