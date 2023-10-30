import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AreasfavoritasComponent } from './areasfavoritas.component';

describe('AreasfavoritasComponent', () => {
  let component: AreasfavoritasComponent;
  let fixture: ComponentFixture<AreasfavoritasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AreasfavoritasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AreasfavoritasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
