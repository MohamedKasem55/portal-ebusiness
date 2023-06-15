import { ComponentFixture, TestBed } from '@angular/core/testing'

import { OpenAdditionalAccountComponent } from './open-additional-account.component'

describe('OpenAdditionalAccountComponent', () => {
  let component: OpenAdditionalAccountComponent
  let fixture: ComponentFixture<OpenAdditionalAccountComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpenAdditionalAccountComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(OpenAdditionalAccountComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
