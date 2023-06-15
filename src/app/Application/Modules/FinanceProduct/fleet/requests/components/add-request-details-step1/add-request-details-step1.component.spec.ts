import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequestDetailsStep1Component } from './add-request-details-step1.component';

describe('AddRequestDetailsStep1Component', () => {
  let component: AddRequestDetailsStep1Component;
  let fixture: ComponentFixture<AddRequestDetailsStep1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRequestDetailsStep1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestDetailsStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
