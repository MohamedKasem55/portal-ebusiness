import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsRegistrationComponent } from './alerts-registration.component';

describe('AlertsRegistrationComponent', () => {
  let component: AlertsRegistrationComponent;
  let fixture: ComponentFixture<AlertsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
