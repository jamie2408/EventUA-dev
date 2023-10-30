import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loginForm  } from '../interfaces/login-form.interface';
import { environment } from '../../environments/environment';
import { catchError, tap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { Evento } from '../models/evento.model';
import { registerForm } from '../interfaces/register-form.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuario!: Usuario;


  constructor(private http: HttpClient,
              private router: Router) { }

  login( formData: loginForm){

    return this.http.post(`${environment.base_url}/login`,formData)
        .pipe(
          tap( (res:any) =>{
            localStorage.setItem('token',res['token']);
            const {uid, rol} = res;
            this.usuario = new Usuario(uid, rol);
          })
        );
  }

  register( formData: registerForm){
    return this.http.post(`${environment.base_url}/usuarios`,formData);
  }

  confirm(email: string, code: string): Observable<void> {
    return this.http.post<any>(`${environment.base_url}/confirm?`, {email, code});
  }

  logout() {
    this.limpiarLocalStore();
    this.router.navigateByUrl('/login');
  }

  validar(correcto: boolean, incorrecto: boolean): Observable<boolean> {
    const token = localStorage.getItem('token') || '';
    if (token === ''){
      this.limpiarLocalStore();
      return of(incorrecto);
    }

    return this.http.get(`${environment.base_url}/login/token`,this.cabeceras).pipe(
      tap( (res:any) => {
        const { uid, nombre, apellido, email, rol, edad, activo, baneado, imagen, token, asistidos, favoritos} = res;
        localStorage.setItem('token', token);
        this.usuario = new Usuario(uid, rol, email, nombre, apellido,  edad, activo, baneado, imagen, asistidos, favoritos);
      }),
      map (resp => {
        return correcto;
      }),
      catchError ( err => {
        console.warn(err);
        this.limpiarLocalStore();
        return of(incorrecto);
      })
    )


  }
  verifyUser(code: string) {
    if(!code) { code = '';}
    return this.http.get(`${environment.base_url}/login/confirm/?confirmationCode=${code}`);
  };

  validarToken(): Observable<boolean> {
    return this.validar(true, false);

  }

  validarNoToken(): Observable<boolean> {
    return this.validar(false, true);

  }

  limpiarLocalStore(){
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
  }

  nuevoUsuario ( data: Usuario) {
    return this.http.post(`${environment.base_url}/usuarios/`, data, this.cabeceras);
  }

  cargarUsuario( uid: string){
    if(!uid) { uid = '';}
    return this.http.get(`${environment.base_url}/usuarios/?id=${uid}`, this.cabeceras);
  }

  cargarUsuarios( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarUsuariosTodos( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/usuarios/?desde=${desde}&texto=${textoBusqueda}&pag=0` , this.cabeceras);
  }

  actualizarUsuario( uid: string, data: Usuario) {
    return this.http.put(`${environment.base_url}/usuarios/${uid}`, data,  this.cabeceras);
 }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/foto/usuario/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/foto/usuario/${uid}`, datos, this.cabeceras);
  }

  borrarUsuario( uid: string) {
    if (!uid || uid === null) {uid = 'a'; }
    return this.http.delete(`${environment.base_url}/usuarios/${uid}` , this.cabeceras);
  }

  establecerimagen(nueva: string): void {
    this.usuario.imagen = nueva;
  }

  establecerfavoritos(uid: string): void{
    this.usuario.favoritos?.push(uid);
  }
  establecerasistentes(uid: string): void{
    this.usuario.asistidos?.push(uid);
  }

  establecerArray(array: string[]){
    this.usuario.favoritos = array;
  }

  establecerdatos(nombre: string, apellido: string, email: string, edad: number): void {
    this.usuario.nombre = nombre;
    this.usuario.apellido = apellido;
    this.usuario.email = email;
    this.usuario.edad = edad;

  }

  cambiarPassword( uid: string, data: any) {
    return this.http.put(`${environment.base_url}/usuarios/np/${uid}`, data, this.cabeceras);
  }

  get cabeceras() {
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid;
  }

  get imagenURL(): string{
    return this.usuario.imagenUrl;
  }

  get rol(): string{
    return this.usuario.rol;
  }

  get nombre(){
    return this.usuario.nombre;
  }

  get apellido(){
    return this.usuario.apellido;
  }

  get email(){
    return this.usuario.email;
  }

  get edad(){
    return this.usuario.edad;
  }

  get activo(){
    return this.usuario.activo;
  }

  get baneado(){
    return this.usuario.baneado;
  }

  get asistidos(){
    return this.usuario.asistidos;
  }

  get favoritos(){
    return this.usuario.favoritos;
  }

}
