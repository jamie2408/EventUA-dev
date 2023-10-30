import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoauthGuard implements CanActivate {
  constructor( private UsuarioService: UsuarioService,
    private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.UsuarioService.validarNoToken()
        .pipe(
          tap( resp => {
            if (!resp){
              this.router.navigateByUrl('/dashboard');
              this.router.navigateByUrl('/home');
            }
          })
        );
  }

}
