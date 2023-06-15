import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkPaymentSelfOnboardComponent } from './bulk-payment-self-onboard.component';

describe('BulkPaymentSelfOnboardComponent', () => {
  let component: BulkPaymentSelfOnboardComponent;
  let fixture: ComponentFixture<BulkPaymentSelfOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkPaymentSelfOnboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkPaymentSelfOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
