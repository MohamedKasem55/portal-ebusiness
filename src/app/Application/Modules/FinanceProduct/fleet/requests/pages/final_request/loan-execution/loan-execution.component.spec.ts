import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanExecutionComponent } from './loan-execution.component';

describe('LoanExecutionComponent', () => {
  let component: LoanExecutionComponent;
  let fixture: ComponentFixture<LoanExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoanExecutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
