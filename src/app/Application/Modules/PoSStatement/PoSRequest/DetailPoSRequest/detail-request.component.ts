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
  urlBack = ['/posstatement/pos-request']

  subscriptions: Subscription[] = []

  element: any

  constructor(
    public fb: FormBuilder,
    public serviceData: RequestShareService,
    private service: ManageRequestService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.element = this.serviceData.getDataInit()
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

  isFirstForm() {
    return false //(this.element['requestType'].value =="001");
  }
}
