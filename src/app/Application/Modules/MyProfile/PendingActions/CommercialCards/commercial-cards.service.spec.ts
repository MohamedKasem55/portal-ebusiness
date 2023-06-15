import { TestBed } from '@angular/core/testing'

import { CommercialCardsService } from './commercial-cards.service'

describe('CommercialCardsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}))

  it('should be created', () => {
    const service: CommercialCardsService = TestBed.get(CommercialCardsService)
    expect(service).toBeTruthy()
  })
})
