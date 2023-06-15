import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDeleteNonFinancialRequestStatusComponent } from './workflow-delete-non-financial-request-status.component';

describe('WorkflowDeleteNonFinancialRequestStatusComponent', () => {
  let component: WorkflowDeleteNonFinancialRequestStatusComponent;
  let fixture: ComponentFixture<WorkflowDeleteNonFinancialRequestStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDeleteNonFinancialRequestStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDeleteNonFinancialRequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
