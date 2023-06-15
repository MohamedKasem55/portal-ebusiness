import { TestBed, inject } from '@angular/core/testing'

import { BulkPaymentGuard } from './Hajj-umrah.guard'

describe('BulkPaymentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BulkPaymentGuard],
    })
  })

  it('should ...', inject([BulkPaymentGuard], (guard: BulkPaymentGuard) => {
    expect(guard).toBeTruthy()
  }))
})
