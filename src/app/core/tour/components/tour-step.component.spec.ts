import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import { BehaviorSubject } from 'rxjs'
import { Router, RouterModule } from '@angular/router'
import { PLATFORM_ID, Inject } from '@angular/core'
import { TourStepComponent } from './tour-step.component'
import { TourService } from '../services/tour.service'
import { StepTargetService } from '../services/step-target.service'
import { AngularTourModule } from '../ng-tour.module'

describe('TourStepComponent', () => {
  let component: TourStepComponent
  let fixture: ComponentFixture<TourStepComponent>
  let tour: TourService = null
  let router: Router
  let target: StepTargetService
  const stepsStream$ = new BehaviorSubject<any>('first')
  const dummyApp = document.createElement('div')
  dummyApp.setAttribute('ngTourStepARB', 'first')

  beforeEach(async(() => {
    tour = new TourService(router, target, PLATFORM_ID)
    target = new StepTargetService()
    TestBed.configureTestingModule({
      imports: [AngularTourModule, RouterModule],
      // declarations: [TourStepComponent],
      providers: [
        { provide: TourService, useValue: tour },
        { provide: StepTargetService, useValue: target },
      ],
      schemas: [],
    }).compileComponents()
  }))
  beforeEach(() => {
    fixture = TestBed.createComponent(TourStepComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
    const userService = fixture.debugElement.injector.get(TourService)
    const usService = TestBed.get(TourService)
  })
  it('simple test', () => {
    expect(true).toBe(true)
  })
})
