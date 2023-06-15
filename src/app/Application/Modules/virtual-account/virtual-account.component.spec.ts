import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { VirtualAccountComponent } from './virtual-account.component'

describe('VirtualAccountComponent', () => {
  let component: VirtualAccountComponent
  let fixture: ComponentFixture<VirtualAccountComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VirtualAccountComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(VirtualAccountComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
