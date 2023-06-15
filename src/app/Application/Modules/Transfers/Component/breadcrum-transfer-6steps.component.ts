import { Component, Input, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'breadcrum-transfer-6-steps',
  templateUrl: '../View/breadcrum-transfer-6-steps.html',
})
export class BreadcrumTransfer6Steps implements OnInit, OnDestroy {
  @Input() currentStep: number

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
