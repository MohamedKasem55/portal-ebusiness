import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkBillPaymentsComponent } from './bulk-bill-payments.component';

describe('BulkBillPaymentsComponent', () => {
  let component: BulkBillPaymentsComponent;
  let fixture: ComponentFixture<BulkBillPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkBillPaymentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkBillPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
