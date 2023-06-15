import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { BopComponent } from './bop.component'

describe('BopComponent', () => {
  let component: BopComponent
  let fixture: ComponentFixture<BopComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BopComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(BopComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
