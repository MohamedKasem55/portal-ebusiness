import {
  Directive,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ElementRef,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentFactory,
} from '@angular/core'
import { isPlatformBrowser } from '@angular/common'
import { Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'

import { StepTargetService } from '../services/step-target.service'
import { TourStepComponent } from '../components/tour-step.component'
import { TourService } from '../services/tour.service'

// @dynamic
@Directive({
  selector: '[ngIfTourARB]',
})
export class TourRootDirective implements OnInit, OnDestroy {
  customTemplate = false
  private readonly onDestroy = new Subject<any>()
  isEmbedded: boolean
  isCreated: boolean
  isBrowser: boolean
  modalFactory: ComponentFactory<TourStepComponent>
  constructor(
    private elem: ElementRef,
    private readonly tourService: TourService,
    private readonly targetService: StepTargetService,
    private viewContainer: ViewContainerRef,
    private componentFactory: ComponentFactoryResolver,
    // @dynamic
    @Inject(PLATFORM_ID) platformId: {},
  ) {
    this.isBrowser = isPlatformBrowser(platformId)
    this.modalFactory =
      this.componentFactory.resolveComponentFactory(TourStepComponent)
  }
  ngOnInit() {
    if (!this.isBrowser) {
      return
    }
    const parent = this.elem.nativeElement.parentNode
    const children = Array.prototype.slice.apply(parent.childNodes)
    if (parent.localName !== 'app-root') {
      console.warn(`You placed ngIfTour directive in ${this.elem.nativeElement.localName} inside ${parent.localName}.
                Are you sure ${parent.localName} better choice then app-root?`)
    }
    const isTourTemplate = children.filter(
      (c: Element) => c.localName === 'ng-tour-step-template-arb',
    ).length
    let componentRef: any
    if (isTourTemplate) {
      this.tourService.setPresets({ customTemplate: true })
    } else {
      this.targetService
        .getTargetSubject()
        .pipe(
          takeUntil(this.onDestroy),
          map((step: any) => {
            if (step && !this.isCreated) {
              this.isCreated = true
              componentRef = this.viewContainer.createComponent(
                this.modalFactory,
              )
            } else if (!step && this.isCreated) {
              this.isCreated = false
              if (this.viewContainer.indexOf(componentRef) > -1) {
                this.viewContainer.remove(
                  this.viewContainer.indexOf(componentRef),
                )
              }
            }
            return step
          }),
        )
        .subscribe()
    }
  }
  ngOnDestroy() {
    this.onDestroy.next()
  }
}
