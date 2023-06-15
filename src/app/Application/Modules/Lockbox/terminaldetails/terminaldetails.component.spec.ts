import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { TerminaldetailsComponent } from './terminaldetails.component'

describe('TerminaldetailsComponent', () => {
  let component: TerminaldetailsComponent
  let fixture: ComponentFixture<TerminaldetailsComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TerminaldetailsComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminaldetailsComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
