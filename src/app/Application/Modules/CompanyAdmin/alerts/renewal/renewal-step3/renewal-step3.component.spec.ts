import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalStep3Component } from './renewal-step3.component';

describe('RenewalStep3Component', () => {
  let component: RenewalStep3Component;
  let fixture: ComponentFixture<RenewalStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
