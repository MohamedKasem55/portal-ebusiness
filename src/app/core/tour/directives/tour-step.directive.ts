import {
  Directive,
  Input,
  Inject,
  PLATFORM_ID,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Renderer2,
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { Subscription, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'

import { StepTargetService } from '../services/step-target.service'
import { TourService } from '../services/tour.service'

// @dynamic
@Directive({
  selector: '[ngTourStepARB]',
})
export class TourStepDirective implements AfterViewInit, OnDestroy {
  @Input('ngTourStepARB') name: string
  private readonly onDestroy = new Subject<any>()
  subscription: Subscription
  isBrowser: boolean
  timeout: any
  constructor(
    private elemRef: ElementRef,
    private readonly tour: TourService,
    private readonly stepTarget: StepTargetService,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {},
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
  }

  ngAfterViewInit() {
    if (!this.isBrowser) {
      return
    }
    this.tour
      .getStepsStream()
      .pipe(
        takeUntil(this.onDestroy),
        map((stepName: string) => {
          let directiveStepName = ''
          if (this.tour.getStepByName(stepName)) {
            directiveStepName =
              this.tour.getStepByName(stepName).directiveStepName
          }
          if (
            !stepName ||
            (this.name !== stepName && this.name != directiveStepName)
          ) {
            return stepName
          } else {
            let target: HTMLElement = this.elemRef.nativeElement
            const delay = this.tour.isRouteChanged()
              ? this.tour.getStepByName(stepName).options.delay
              : 0

            if (this.tour.getStepByName(stepName).targetChildQuerySelector) {
              const subTarget = target.querySelector(
                this.tour.getStepByName(stepName).targetChildQuerySelector,
              )
              target = subTarget ? subTarget : target
            }

            this.timeout = setTimeout(() => {
              this.stepTarget.setTargetSubject({ target, stepName })
              // get config for element to "execute"  click if not defined execute target Click
              if (this.tour.getStepByName(stepName).executeClick) {
                const querySelectorElementToClick =
                  this.tour.getStepByName(stepName).querySelectorElementToClick
                if (querySelectorElementToClick) {
                  const element = document.querySelector(
                    querySelectorElementToClick,
                  )
                  if (element) {
                    document.querySelector(querySelectorElementToClick).click()
                  }
                } else {
                  target.click()
                }
              }
            }, delay)
            return stepName
          }
        }),
      )
      .subscribe()
  }
  ngOnDestroy() {
    this.onDestroy.next()
    clearTimeout(this.timeout)
  }
}
