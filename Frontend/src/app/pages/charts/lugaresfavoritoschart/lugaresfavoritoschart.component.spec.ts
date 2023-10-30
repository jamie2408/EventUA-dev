import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LugaresfavoritoschartComponent } from './lugaresfavoritoschart.component';

describe('LugaresfavoritoschartComponent', () => {
  let component: LugaresfavoritoschartComponent;
  let fixture: ComponentFixture<LugaresfavoritoschartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LugaresfavoritoschartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LugaresfavoritoschartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
