import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithinTransferStep3Component } from './within-transfer-step3.component';

describe('WithinTransferStep3Component', () => {
  let component: WithinTransferStep3Component;
  let fixture: ComponentFixture<WithinTransferStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithinTransferStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithinTransferStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
