import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickOwnTransferStep3Component } from './quick-own-transfer-step3.component';

describe('QuickOwnTransferStep3Component', () => {
  let component: QuickOwnTransferStep3Component;
  let fixture: ComponentFixture<QuickOwnTransferStep3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickOwnTransferStep3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickOwnTransferStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
