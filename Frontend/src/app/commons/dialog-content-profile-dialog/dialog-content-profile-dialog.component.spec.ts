import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContentProfileDialogComponent } from './dialog-content-profile-dialog.component';

describe('DialogContentProfileDialogComponent', () => {
  let component: DialogContentProfileDialogComponent;
  let fixture: ComponentFixture<DialogContentProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContentProfileDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContentProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
