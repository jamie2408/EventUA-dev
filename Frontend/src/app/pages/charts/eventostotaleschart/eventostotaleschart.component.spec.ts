import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventostotaleschartComponent } from './eventostotaleschart.component';

describe('EventostotaleschartComponent', () => {
  let component: EventostotaleschartComponent;
  let fixture: ComponentFixture<EventostotaleschartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventostotaleschartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventostotaleschartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
