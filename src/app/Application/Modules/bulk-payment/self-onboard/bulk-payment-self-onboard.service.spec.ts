import { TestBed } from '@angular/core/testing';

import { BulkPaymentSelfOnboardService } from './bulk-payment-self-onboard.service';

describe('BulkPaymentSelfOnboardService', () => {
  let service: BulkPaymentSelfOnboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkPaymentSelfOnboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
