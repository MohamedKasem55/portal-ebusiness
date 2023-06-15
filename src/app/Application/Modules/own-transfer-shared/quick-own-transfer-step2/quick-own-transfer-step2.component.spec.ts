import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickOwnTransferStep2Component } from './quick-own-transfer-step2.component';

describe('QuickOwnTransferStep2Component', () => {
  let component: QuickOwnTransferStep2Component;
  let fixture: ComponentFixture<QuickOwnTransferStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickOwnTransferStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickOwnTransferStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
