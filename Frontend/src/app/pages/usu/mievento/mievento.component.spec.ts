import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MieventoComponent } from './mievento.component';

describe('MieventoComponent', () => {
  let component: MieventoComponent;
  let fixture: ComponentFixture<MieventoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MieventoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MieventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
