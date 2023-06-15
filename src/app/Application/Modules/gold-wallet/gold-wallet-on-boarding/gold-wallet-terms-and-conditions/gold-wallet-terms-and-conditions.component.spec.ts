import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldWalletTermsAndConditionsComponent } from './gold-wallet-terms-and-conditions.component';

describe('GoldWalletTermsAndConditionsComponent', () => {
  let component: GoldWalletTermsAndConditionsComponent;
  let fixture: ComponentFixture<GoldWalletTermsAndConditionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldWalletTermsAndConditionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldWalletTermsAndConditionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
