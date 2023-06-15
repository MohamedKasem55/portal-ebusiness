import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeSmsAlertComponent } from './free-sms-alert.component';

describe('FreeSmsAlertComponent', () => {
  let component: FreeSmsAlertComponent;
  let fixture: ComponentFixture<FreeSmsAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FreeSmsAlertComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeSmsAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
