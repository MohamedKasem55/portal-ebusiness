import { Component, Input, OnDestroy, OnInit } from '@angular/core'

@Component({
  selector: 'breadcrum-transfer-4-steps',
  templateUrl: '../View/breadcrum-transfer-4-steps.html',
})
export class BreadcrumTransfer4Steps implements OnInit, OnDestroy {
  @Input() currentStep: number

  constructor() {}

  ngOnInit() {}

  ngOnDestroy() {}
}
