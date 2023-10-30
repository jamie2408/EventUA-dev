import { Component, OnInit } from '@angular/core';

declare function iniciarCustom(): any;

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./style.css']
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    iniciarCustom();
  }

}

