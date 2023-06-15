import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedAccountStepComponent } from './linked-account-step.component';

describe('LinkedAccountStepComponent', () => {
  let component: LinkedAccountStepComponent;
  let fixture: ComponentFixture<LinkedAccountStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkedAccountStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkedAccountStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
