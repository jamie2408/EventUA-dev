import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public formSubmit = false;
  public waiting=false;

  public loginForm = this.fb.group({
    email:  [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required],
    remember: [ false || localStorage.getItem('email') ]
  });

  constructor( private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    this.usuarioService.validarToken()
      .subscribe(res => {
        if(res) {
          this.router.navigateByUrl('/dashboard');
        }
      });

  }

  login() {
    this.formSubmit = true;
    //console.log(this.loginForm);


    if(!this.loginForm.valid || !this.comprobarEmailUA(this.loginForm.get('email')!.value)){
     // console.log('Errores en el formulario');
      return;
    } else {
     // console.log('Correcto');
    }


    this.waiting = true;
    this.usuarioService.login(this.loginForm.value)
    .subscribe((res: any) => {

      localStorage.setItem('token', res['token']);
      if (this.loginForm.get('remember')!.value){
        localStorage.setItem('email', this.loginForm.get('email')!.value);
      } else {
        localStorage.removeItem('email');
      }
      this.router.navigateByUrl('/admin/dashboard');
      this.waiting = false;
    },(err) => {
       console.warn('Error respuesta api', err);
       Swal.fire({
        title: 'Error!',
        text: err.error.msg || 'Error de conexión, inténtelo mas tarde.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        allowOutsideClick: false
      });
      this.waiting = false;
     });
  }

  campoValido( campo: string) {
    return this.loginForm.get(campo)?.valid || !this.formSubmit;
  }

  comprobarEmailUA( email: string) {
    var emailDividido = email.split("@");
    var terminacion = emailDividido[1].split(".");

    if(terminacion[terminacion.length-2] === "ua" && terminacion[terminacion.length-1] === "es"){
      return true;
    } else {
      return false;
    }
  }

}
