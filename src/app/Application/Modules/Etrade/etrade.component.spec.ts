import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { EtradeComponent } from './etrade.component'


describe('EtradeComponent', () => {
  let component: EtradeComponent
  let fixture: ComponentFixture<EtradeComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EtradeComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(EtradeComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
