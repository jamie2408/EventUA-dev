import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventoscreadosComponent } from './eventoscreados.component';

describe('EventoscreadosComponent', () => {
  let component: EventoscreadosComponent;
  let fixture: ComponentFixture<EventoscreadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventoscreadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventoscreadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
