import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickOwnTransferStep4Component } from './quick-own-transfer-step4.component';

describe('QuickOwnTransferStep4Component', () => {
  let component: QuickOwnTransferStep4Component;
  let fixture: ComponentFixture<QuickOwnTransferStep4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickOwnTransferStep4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickOwnTransferStep4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
