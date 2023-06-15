import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { InformationDataComponent } from './information-data.component'

describe('InformationDataComponent', () => {
  let component: InformationDataComponent
  let fixture: ComponentFixture<InformationDataComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InformationDataComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationDataComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
