import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsRegistrationStep2Component } from './alerts-registration-step2.component';

describe('AlertsRegistrationStep2Component', () => {
  let component: AlertsRegistrationStep2Component;
  let fixture: ComponentFixture<AlertsRegistrationStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsRegistrationStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsRegistrationStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
