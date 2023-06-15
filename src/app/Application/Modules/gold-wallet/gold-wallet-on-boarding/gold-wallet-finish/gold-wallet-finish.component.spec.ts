import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldWalletFinishComponent } from './gold-wallet-finish.component';

describe('GoldWalletFinishComponent', () => {
  let component: GoldWalletFinishComponent;
  let fixture: ComponentFixture<GoldWalletFinishComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldWalletFinishComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldWalletFinishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
