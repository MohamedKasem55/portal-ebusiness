import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeActivateStep2Component } from './de-activate-step2.component';

describe('DeActivateStep2Component', () => {
  let component: DeActivateStep2Component;
  let fixture: ComponentFixture<DeActivateStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeActivateStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeActivateStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
