import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuFooterComponent } from './usu-footer.component';

describe('UsuFooterComponent', () => {
  let component: UsuFooterComponent;
  let fixture: ComponentFixture<UsuFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuFooterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
