import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDialogComponent } from './visit-dialog.component';

describe('VisitDialogComponent', () => {
  let component: VisitDialogComponent;
  let fixture: ComponentFixture<VisitDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisitDialogComponent]
    });
    fixture = TestBed.createComponent(VisitDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
