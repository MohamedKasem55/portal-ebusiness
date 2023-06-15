import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsRegistrationStep3Component } from './alerts-registration-step3.component';

describe('AlertsRegistrationStep3Component', () => {
  let component: AlertsRegistrationStep3Component;
  let fixture: ComponentFixture<AlertsRegistrationStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsRegistrationStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsRegistrationStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
