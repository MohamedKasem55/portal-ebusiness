import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldWalletSummaryComponent } from './gold-wallet-summary.component';

describe('GoldWalletSummaryComponent', () => {
  let component: GoldWalletSummaryComponent;
  let fixture: ComponentFixture<GoldWalletSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldWalletSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldWalletSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
