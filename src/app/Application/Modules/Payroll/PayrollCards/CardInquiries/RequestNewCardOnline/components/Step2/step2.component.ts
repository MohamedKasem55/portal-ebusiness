import { Component, OnInit, ViewChild } from '@angular/core'

@Component({
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit {
  @ViewChild('authorization') authorization: any
  step = 2
  sharedData: any = {}

  constructor() {}

  ngOnInit(): void {
    this.sharedData.requestValidate = {}
  }

  valid() {
    if (!this.authorization) {
      return true
    }
    return this.authorization.valid()
  }
}
