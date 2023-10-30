import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-confirmed',
  templateUrl: './confirmed.component.html',
  styleUrls: ['./confirmed.component.css']
})

export class ConfirmedComponent implements OnInit {
  public confirmationCode: string = '';
  public response: any;
  constructor(private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.confirmationCode = this.route.snapshot.params['confirmationCode'];
    this.verifyUser();
    }
  verifyUser(){
    this.response = this.usuarioService.verifyUser(this.confirmationCode).subscribe();


  }

}
