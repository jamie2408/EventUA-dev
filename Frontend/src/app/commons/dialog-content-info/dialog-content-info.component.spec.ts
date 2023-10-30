import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentInfoComponent } from './dialog-content-info.component';

describe('DialogContentInfoComponent', () => {
  let component: DialogContentInfoComponent;
  let fixture: ComponentFixture<DialogContentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
