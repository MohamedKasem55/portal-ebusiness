import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeActivateStep3Component } from './de-activate-step3.component';

describe('DeActivateStep3Component', () => {
  let component: DeActivateStep3Component;
  let fixture: ComponentFixture<DeActivateStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeActivateStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeActivateStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
