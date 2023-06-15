import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationSummaryStepComponent } from './application-summary-step.component';

describe('ApplicationSummaryStepComponent', () => {
  let component: ApplicationSummaryStepComponent;
  let fixture: ComponentFixture<ApplicationSummaryStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplicationSummaryStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationSummaryStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
