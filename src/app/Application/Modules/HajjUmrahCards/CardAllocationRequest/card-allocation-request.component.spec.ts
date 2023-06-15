import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { CardAllocationRequestComponent } from './card-allocation-request.component'

describe('CardAllocationRequestComponent', () => {
  let component: CardAllocationRequestComponent
  let fixture: ComponentFixture<CardAllocationRequestComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CardAllocationRequestComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAllocationRequestComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
