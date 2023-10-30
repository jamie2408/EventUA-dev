import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuNavbarComponent } from './usu-navbar.component';

describe('UsuNavbarComponent', () => {
  let component: UsuNavbarComponent;
  let fixture: ComponentFixture<UsuNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
