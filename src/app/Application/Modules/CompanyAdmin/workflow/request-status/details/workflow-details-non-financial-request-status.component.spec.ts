import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDetailsNonFinancialRequestStatusComponent } from './workflow-details-non-financial-request-status.component';

describe('WorkflowDeleteNonFinancialRequestStatusComponent', () => {
  let component: WorkflowDetailsNonFinancialRequestStatusComponent;
  let fixture: ComponentFixture<WorkflowDetailsNonFinancialRequestStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDetailsNonFinancialRequestStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDetailsNonFinancialRequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
