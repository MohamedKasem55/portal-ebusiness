import { TestBed, inject } from '@angular/core/testing'

import { CardalloctionGuard } from './cardalloction.guard'

describe('CardalloctionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CardalloctionGuard],
    })
  })

  it('should ...', inject([CardalloctionGuard], (guard: CardalloctionGuard) => {
    expect(guard).toBeTruthy()
  }))
})
