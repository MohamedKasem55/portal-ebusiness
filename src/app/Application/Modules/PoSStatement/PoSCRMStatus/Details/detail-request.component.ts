import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'

import { FormBuilder } from '@angular/forms'
import { ManageRequestService } from '../manage-request.service'
import { RequestShareService } from '../request-share.service'

@Component({
  selector: 'app-detail-request',
  templateUrl: './detail-request.component.html',
  styleUrls: ['./detail-request.component.scss'],
})
export class DetailRequestComponent implements OnInit, OnDestroy {
  urlBack = ['/posstatement/crm-status']

  subscriptions: Subscription[] = []

  element: any
  type: any

  constructor(
    public fb: FormBuilder,
    public serviceData: RequestShareService,
    public service: ManageRequestService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.element = this.serviceData.getDataInit()
    this.type = this.element.typeOfRequest.substring(0, 1)
    this.serviceData.clearDataInit()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
  }

  goBack() {
    this.router.navigate(this.urlBack)
  }
}
