import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public formSubmit = false;
  public waiting=false;

  public registerForm = this.fb.group({
    email:  [localStorage.getItem('email') || '', [Validators.required, Validators.email] ],
    password: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
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

  register() {

    this.formSubmit = true;
    //console.log(this.loginForm);


    if(!this.registerForm.valid || !this.comprobarEmailUA(this.registerForm.get('email')!.value)){
     // console.log('Errores en el formulario');
      return;
    } else {
     // console.log('Correcto');
    }

     

    this.waiting = true;
    this.usuarioService.register(this.registerForm.value)
    .subscribe((res: any) => {

      localStorage.setItem('token', res['token']);
      localStorage.setItem('email', this.registerForm.get('email')!.value);
      this.router.navigate(['/confirmar']);
      this.router.navigateByUrl('/confirmar');
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
    return this.registerForm.get(campo)?.valid || !this.formSubmit;
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
