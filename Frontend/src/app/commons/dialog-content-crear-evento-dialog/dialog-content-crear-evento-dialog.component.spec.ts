import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentCrearEventoDialogComponent } from './dialog-content-crear-evento-dialog.component';

describe('DialogContentCrearEventoDialogComponent', () => {
  let component: DialogContentCrearEventoDialogComponent;
  let fixture: ComponentFixture<DialogContentCrearEventoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentCrearEventoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentCrearEventoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
