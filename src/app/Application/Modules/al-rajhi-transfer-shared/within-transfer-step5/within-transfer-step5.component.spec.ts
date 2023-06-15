import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithinTransferStep5Component } from './within-transfer-step5.component';

describe('WithinTransferStep5Component', () => {
  let component: WithinTransferStep5Component;
  let fixture: ComponentFixture<WithinTransferStep5Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithinTransferStep5Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithinTransferStep5Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
