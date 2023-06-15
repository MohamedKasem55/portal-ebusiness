import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WithinTransferStep2Component } from './within-transfer-step2.component';

describe('WithinTransferStep2Component', () => {
  let component: WithinTransferStep2Component;
  let fixture: ComponentFixture<WithinTransferStep2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WithinTransferStep2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WithinTransferStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
