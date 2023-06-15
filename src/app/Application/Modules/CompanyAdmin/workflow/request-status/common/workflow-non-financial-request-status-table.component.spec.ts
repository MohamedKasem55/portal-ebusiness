import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowNonFinancialRequestStatusTableComponent } from './workflow-non-financial-request-status-table.component';

describe('WorkflowNonFinantialRequestStatusTableComponent', () => {
  let component: WorkflowNonFinancialRequestStatusTableComponent;
  let fixture: ComponentFixture<WorkflowNonFinancialRequestStatusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowNonFinancialRequestStatusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowNonFinancialRequestStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
