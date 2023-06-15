import { TestBed } from '@angular/core/testing'

import { BulkPaymentService } from './bulk-payment.service'

describe('BulkPaymentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: BulkPaymentService = TestBed.get(BulkPaymentService)
    expect(service).toBeTruthy()
  })
})
