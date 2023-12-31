import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { Observable, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

import { TourService, TourStep } from '../services/tour.service'
import { TargetSize, StepTargetService } from '../services/step-target.service'

export interface StepEvents {
  onNext($event: Event): void
  onPrev($event: Event): void
  onClose($event: Event): void
}

// @dynamic
@Component({
  selector: 'ng-tour-step-template-arb',
  templateUrl: './tour-step.component.html',
  styleUrls: ['./tour-step.component.scss'],
  exportAs: 'steps$',
  encapsulation: ViewEncapsulation.None,
})
export class TourStepComponent implements OnInit, OnDestroy, StepEvents {
  class: string
  targetElement: Element
  target: TargetSize
  currentStep: TourStep = null
  steps$: Observable<TourStep> = null
  isBrowser: boolean
  onDestroy = new Subject<any>()
  timeouts: any[] = []
  stepModalPosition: {
    top?: number
    left?: number
    right?: number
    bottom?: number
  }
  modalHeight: number
  targetBackground: string
  initialTopSize: number = 91
  @Output() next: EventEmitter<any> = new EventEmitter()
  @Output() prev: EventEmitter<any> = new EventEmitter()
  @Output() done: EventEmitter<any> = new EventEmitter()
  @Output() break: EventEmitter<any> = new EventEmitter()

  constructor(
    private readonly tourService: TourService,
    private readonly stepTargetService: StepTargetService,
    private elem: ElementRef,
    private translate: TranslateService,
    // private ref: ViewContainerRef,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {},
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
  }
  @HostListener('document:click', ['$event']) clickOutsideToClose(
    $Event: Event,
  ): void {
    if (this.currentStep) {
      if (
        this.currentStep.options.closeOnClickOutside &&
        !this.elem.nativeElement.contains($Event.target)
      ) {
        this.onClose($Event)
      }
    }
  }
  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    if (this.target && this.currentStep) {
      this.saveTarget(this.targetElement)
      this.defineStepPlacementToTarget()
    }
  }
  ngOnInit() {
    if (!this.isBrowser) {
      return
    }
    this.stepModalPosition = { top: -1000, left: -1000 }
    this.subscribeToStepsStream()
    this.steps$ = this.stepTargetService.getTargetSubject().pipe(
      map((step) => {
        if (this.currentStep) {
          return this.currentStep
        }
        if (step && this.tourService.getTourStatus) {
          this.targetElement = step.target
          this.currentStep = this.tourService.getStepByName(step.stepName)
          this.saveStepData()
          this.saveTarget(step.target)
          return this.currentStep
        }
        return step
      }),
    )
  }
  ngOnDestroy() {
    this.onDestroy.next()
    this.timeouts.forEach((i) => clearTimeout(i))
  }

  private subscribeToStepsStream() {
    this.tourService
      .getStepsStream()
      .pipe(
        takeUntil(this.onDestroy),
        map((step) => {
          if (!step) {
            this.currentStep = null
            return step
          }

          const { themeColor } =
            (this.currentStep && this.currentStep.options) ||
            this.tourService.getStepByIndex().options
          this.currentStep = null
          this.resetClasses()
          const { delay } = this.tourService.getStepByName(step).options
          this.targetBackground = themeColor
          if (this.tourService.isRouteChanged()) {
            this.timeouts[this.timeouts.length] = setTimeout(
              () => this.checkTarget(step),
              delay + 100,
            )
          } else {
            this.timeouts[this.timeouts.length] = setTimeout(
              () => this.checkTarget(step),
              100,
            )
          }
          return step
        }),
      )
      .subscribe()
  }
  private checkTarget(step: string, times = 2) {
    if (!step || !this.tourService.getTourStatus()) {
      return
    }
    const delay = this.tourService.getStepByName(step).options.delay
    const target = document.querySelector(`[ngtoursteparb=${step}]`)
    const subTarget = document.querySelector(
      this.tourService.getStepByName(step).targetChildQuerySelector,
    )

    if (times && this.tourService.isRouteChanged() && !target && !subTarget) {
      this.timeouts[this.timeouts.length] = setTimeout(
        () => this.checkTarget(step, times - 1),
        delay,
      )
    } else if (!target && !subTarget) {
      console.warn(`Target is missed for step ${step}`)
      if (this.tourService.getStepByName(step).options.continueIfTargetAbsent) {
        const index = this.tourService.getStepByName(step).index + 1
        if (index < this.tourService.getLastStep().total) {
          this.tourService.nextStep()
        } else {
          console.warn(
            `The tour is stopped because of no targets is found  for step ${step} and next ones`,
          )
          this.tourService.stopTour()
          this.stepTargetService.setTargetSubject(null)
        }
      }
    }
  }
  private resetClasses(): void {
    const step = this.currentStep
    const source =
      (step && step.options) || this.tourService.getStepByIndex().options
    const { arrowToTarget, animatedStep, placement, className, arrowPosition } =
      source
    const arrowClass = arrowToTarget ? 'with-arrow' : ''
    const arrowPositionClass = arrowPosition
      ? `with-arrow-${arrowPosition}`
      : 'with-arrow-center' // with-arrow-left, with-arrow-center,with-arrow-right
    const animationClass = animatedStep
      ? step
        ? 'animation-on'
        : 'fade-on'
      : step
      ? ''
      : 'fade-on'
    this.class =
      `${arrowClass} ${arrowPositionClass} ${className} pos-${placement} ${animationClass}`.trim()
    if (step) {
      this.class += ` ${step.stepName}`
    }
  }
  private saveTarget(target: Element): void {
    this.target = this.stepTargetService.resizeTarget(
      this.stepTargetService.getSizeAndPosition(target),
      this.currentStep.options.stepTargetResize,
    )
    if (this.shoulAlignRight()) {
      this.target.left = this.target.right
    }
    this.timeouts[this.timeouts.length] = setTimeout(
      () => this.defineStepPlacementToTarget(),
      0,
    )
  }
  private saveStepData(): void {
    this.resetClasses()
    this.targetBackground = 'transparent'
  }

  /**
   * @deprecated Use placementTopOrDown_HorizontalOffset,placementTopOrDown_VerticalOffset,
   * placementLeftOrRight_VerticalOffset, placementLeftOrRight_HorizontalOffset
   * @private
   */
  private defineStepPlacementToWindow(placement: string, modalWidth: number) {
    if (/^right-center$/i.test(placement)) {
      this.stepModalPosition = {
        right: 50,
        top: Math.round(window.innerHeight / 2 - this.modalHeight / 2),
      }
    } else if (/^left-center$/i.test(placement)) {
      this.stepModalPosition = {
        left: 50,
        top: Math.round(window.innerHeight / 2 - this.modalHeight / 2),
      }
    } else if (/^center$/i.test(placement)) {
      this.stepModalPosition = {
        left: Math.round(window.innerWidth / 2 - modalWidth / 2),
        top: Math.round(window.innerHeight / 2 - this.modalHeight / 2),
      }
    }
  }

  private defineStepPlacementToTarget() {
    const modal = this.elem.nativeElement.querySelector('.tour-step-modal')
    if (!modal) {
      this.timeouts[this.timeouts.length] = setTimeout(
        () => this.defineStepPlacementToTarget(),
        100,
      )
      return
    }
    const modalRect = modal.getBoundingClientRect()
    this.modalHeight = Math.round(
      modalRect.height ? modalRect.height : modalRect.bottom - modalRect.top,
    )
    const modalWidth = Math.round(
      modalRect.width ? modalRect.width : modalRect.right - modalRect.left,
    )

    const {
      placement,
      scrollTo,
      placementTopOrDown_HorizontalOffset,
      placementTopOrDown_VerticalOffset,
      placementLeftOrRight_VerticalOffset,
      placementLeftOrRight_HorizontalOffset,
    } = this.currentStep.options
    const { top, bottom, width, left, right } = this.target

    if (/^down$/i.test(placement)) {
      if (!this.shoulAlignRight()) {
        this.stepModalPosition = {
          top:
            this.currentStep.stepName === StepTargetService.INITIAL_STEP_NAME
              ? this.initialTopSize
              : bottom + placementTopOrDown_VerticalOffset,
          left: Math.round(left + placementTopOrDown_HorizontalOffset),
        }
      } else {
        this.stepModalPosition = {
          top: bottom + placementTopOrDown_VerticalOffset,
          right: Math.round(right + placementTopOrDown_HorizontalOffset),
        }
      }
    } else if (/^top$/i.test(placement)) {
      if (!this.shoulAlignRight()) {
        this.stepModalPosition = {
          top: top - this.modalHeight - placementTopOrDown_VerticalOffset,
          left: Math.round(left + placementTopOrDown_HorizontalOffset),
        }
      } else {
        this.stepModalPosition = {
          top: top - this.modalHeight - placementTopOrDown_VerticalOffset,
          right: Math.round(right + placementTopOrDown_HorizontalOffset),
        }
      }
    } else if (/^left$/i.test(placement)) {
      if (!this.shoulAlignRight()) {
        this.stepModalPosition = {
          left: left - modalWidth - placementLeftOrRight_HorizontalOffset,
          top: Math.round(top + placementLeftOrRight_VerticalOffset),
        }
      } else {
        this.stepModalPosition = {
          right: right + width + placementLeftOrRight_HorizontalOffset,
          top: Math.round(top + placementLeftOrRight_VerticalOffset),
        }
      }
    } else if (/^right$/i.test(placement)) {
      if (!this.shoulAlignRight()) {
        this.stepModalPosition = {
          left: left + width + placementLeftOrRight_HorizontalOffset,
          top: Math.round(top + placementLeftOrRight_VerticalOffset),
        }
      } else {
        this.stepModalPosition = {
          right: right - modalWidth - placementLeftOrRight_HorizontalOffset,
          top: Math.round(top + placementLeftOrRight_VerticalOffset),
        }
      }
    }

    // Replaced por config parameters
    // placementTopOrDown_HorizontalOffset,
    // placementTopOrDown_VerticalOffset,
    // placementLeftOrRight_VerticalOffset,
    // placementLeftOrRight_HorizontalOffset
    // else if (/^left-top$/i.test(placement)) {
    //   this.stepModalPosition = {
    //     left: left - modalWidth - 20, top: top - this.modalHeight + 50
    //   };
    // } else if (/^right-top$/i.test(placement)) {
    //   this.stepModalPosition = {
    //     left: right + width + 20, top: top - this.modalHeight + 50
    //   };
    // }
    // else {
    //   this.defineStepPlacementToWindow(placement, modalWidth);
    // }
    if (this.currentStep.options.autofocus) {
      this.setFocus(modal)
    }
    if (scrollTo) {
      this.scrollTo()
    }
  }

  private setFocus(modal: Element) {
    const nextBtn = modal.querySelector('.tour-btn-next') as HTMLElement
    const endBtn = modal.querySelector('.tour-btn-done') as HTMLElement
    if (nextBtn) {
      nextBtn.focus()
    } else if (endBtn) {
      endBtn.focus()
    }
  }
  private scrollTo() {
    const { placement, fixed } = this.currentStep.options
    const left = this.target.left
    const top =
      placement !== 'top'
        ? this.target.top - 100
        : this.target.top - this.modalHeight - 50
    const behavior = this.currentStep.options.smoothScroll ? 'smooth' : 'auto'
    if (!fixed) {
      document.documentElement.scroll({ top, left, behavior })
    } else {
      document.documentElement.scroll({ top: 0, left: 0, behavior })
    }
  }
  public onNext(event: Event) {
    this.next.emit({
      stepEvent: 'next',
      index: this.currentStep.index + 1,
      history: this.tourService.getHistory(),
    })
    this.tourService.nextStep()
  }
  public onPrev(event: Event) {
    this.prev.emit({
      stepEvent: 'prev',
      index: this.currentStep.index - 1,
      history: this.tourService.getHistory(),
    })
    this.tourService.prevStep()
  }
  public onClose(event: Event) {
    if (this.currentStep.index !== this.currentStep.total - 1) {
      this.break.emit({
        stepEvent: 'break',
        index: this.currentStep.index,
        history: this.tourService.getHistory(),
      })
    } else {
      this.done.emit({
        stepEvent: 'done',
        index: this.currentStep.index,
        history: this.tourService.getHistory(),
      })
    }
    this.tourService.stopTour()
  }
  private shoulAlignRight() {
    return this.translate.currentLang === 'ar'
  }
}
