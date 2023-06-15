import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalStep2Component } from './renewal-step2.component';

describe('RenewalStep2Component', () => {
  let component: RenewalStep2Component;
  let fixture: ComponentFixture<RenewalStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
