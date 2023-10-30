import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  private subs$: Subscription;

  constructor(private router: Router) { 
    this.subs$ = this.cargarDatos().subscribe( (event:ActivationEnd) => {
      this.titulo = event.snapshot.data.titulo;
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(){
    this.subs$.unsubscribe();
  }

  cargarDatos() {
    return this.router.events
    .pipe(
      filter( (event: any): event is ActivationEnd => event instanceof ActivationEnd ),
      filter( (event: ActivationEnd) => event.snapshot.firstChild === null)
    );
  }

}
