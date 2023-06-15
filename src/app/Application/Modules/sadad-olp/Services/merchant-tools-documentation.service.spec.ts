import { TestBed } from '@angular/core/testing'

import { MerchantToolsDocumentationService } from './merchant-tools-documentation.service'

describe('MerchantToolsDocumentationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: MerchantToolsDocumentationService = TestBed.get(
      MerchantToolsDocumentationService,
    )
    expect(service).toBeTruthy()
  })
})
