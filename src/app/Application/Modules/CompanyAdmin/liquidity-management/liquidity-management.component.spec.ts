import { async, ComponentFixture, TestBed } from '@angular/core/testing'

import { LiquidityManagementComponent } from './liquidity-management.component'

describe('LiquidityManagementComponent', () => {
  let component: LiquidityManagementComponent
  let fixture: ComponentFixture<LiquidityManagementComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LiquidityManagementComponent],
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(LiquidityManagementComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
