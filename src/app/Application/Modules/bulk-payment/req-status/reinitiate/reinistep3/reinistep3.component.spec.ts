import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { Reinistep3Component } from './reinistep3.component'

describe('Reinistep3Component', () => {
  let component: Reinistep3Component
  let fixture: ComponentFixture<Reinistep3Component>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Reinistep3Component],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(Reinistep3Component)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
