import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoldWalletComponent } from './gold-wallet.component';

describe('GoldWalletComponent', () => {
  let component: GoldWalletComponent;
  let fixture: ComponentFixture<GoldWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GoldWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GoldWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
