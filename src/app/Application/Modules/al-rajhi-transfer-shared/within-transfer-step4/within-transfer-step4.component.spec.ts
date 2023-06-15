import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithinTransferStep4Component } from './within-transfer-step4.component';

describe('WithinTransferStep4Component', () => {
  let component: WithinTransferStep4Component;
  let fixture: ComponentFixture<WithinTransferStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithinTransferStep4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithinTransferStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
