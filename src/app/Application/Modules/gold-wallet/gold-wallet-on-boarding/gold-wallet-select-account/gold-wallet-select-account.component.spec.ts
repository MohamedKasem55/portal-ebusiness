import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldWalletSelectAccountComponent } from './gold-wallet-select-account.component';

describe('GoldWalletSelectAccountComponent', () => {
  let component: GoldWalletSelectAccountComponent;
  let fixture: ComponentFixture<GoldWalletSelectAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldWalletSelectAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldWalletSelectAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
