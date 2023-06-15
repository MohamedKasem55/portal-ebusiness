import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowRequestStatusComponent } from './workflow-request-status.component';

describe('WorkflowRequestStatusComponent', () => {
  let component: WorkflowRequestStatusComponent;
  let fixture: ComponentFixture<WorkflowRequestStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowRequestStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowRequestStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
