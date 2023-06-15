import { Component, Input, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'breadcrum-transfer-5-steps',
  templateUrl: '../View/breadcrum-transfer-5-steps.html',
})
export class BreadcrumTransfer5Steps implements OnInit, OnDestroy {
  @Input() currentStep: number

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
