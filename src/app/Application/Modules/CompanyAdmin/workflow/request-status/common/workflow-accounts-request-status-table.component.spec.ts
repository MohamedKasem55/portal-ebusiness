import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowAccountsRequestStatusTableComponent } from './workflow-accounts-request-status-table.component';

describe('WorkflowAccountsRequestStatusTableComponent', () => {
  let component: WorkflowAccountsRequestStatusTableComponent;
  let fixture: ComponentFixture<WorkflowAccountsRequestStatusTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowAccountsRequestStatusTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowAccountsRequestStatusTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
