import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessDetailsStep1Component } from './business-details-step1.component';

describe('BusinessDetailsStep1Component', () => {
  let component: BusinessDetailsStep1Component;
  let fixture: ComponentFixture<BusinessDetailsStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusinessDetailsStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessDetailsStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
