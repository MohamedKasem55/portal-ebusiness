import { TestBed, inject } from '@angular/core/testing'

import { CommercialCardsGuard } from './commercial-cards.guard'

describe('CommercialCardsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CommercialCardsGuard],
    })
  })

  it('should ...', inject(
    [CommercialCardsGuard],
    (guard: CommercialCardsGuard) => {
      expect(guard).toBeTruthy()
    },
  ))
})
