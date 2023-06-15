import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { CommercialCardsComponent } from './commercial-cards.component'

describe('CommercialCardsComponent', () => {
  let component: CommercialCardsComponent
  let fixture: ComponentFixture<CommercialCardsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommercialCardsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(CommercialCardsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
