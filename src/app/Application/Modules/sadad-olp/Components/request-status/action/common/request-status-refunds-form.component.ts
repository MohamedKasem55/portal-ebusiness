import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { ManageRequestStatusRefundsEntityService } from '../../request-status-refunds-entity.service'

@Component({
  selector: 'app-request-status-refunds-form',
  templateUrl: './request-status-refunds-form.component.html',
})
export class RequestStatusRefundFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() readonly: boolean

  subscriptions: Subscription[] = []

  refundsArray: any

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private serviceData: ManageRequestStatusRefundsEntityService,
  ) {}

  modifyOLPRefundsForm(form: FormGroup, refund: any) {
    const control = form.controls['refunds'] as FormArray
    control.push(this.initOLPRefundsForm(refund))
  }

  get refunds(): FormGroup[] {
    return this.form.controls['refunds']['controls']
  }

  initOLPRefundsForm(_refund: any) {
    const refundId = 'sadadOLP.refunds.refundId'
    const transactionId = 'sadadOLP.refunds.transactionId'
    let detailsTitle = ''
    this.subscriptions.push(
      this.translate.get(refundId).subscribe((title) => {
        detailsTitle = title + ': ' + _refund.refundId
      }),
    )
    this.subscriptions.push(
      this.translate.get(transactionId).subscribe((title) => {
        detailsTitle =
          detailsTitle + ' - ' + title + ': ' + _refund.transactionId
      }),
    )

    return this.fb.group({
      transactionAmount: [
        _refund != null ? _refund.transactionAmount : _refund,
        null,
      ],
      transactionDate: [
        _refund != null ? _refund.transactionDate : _refund,
        null,
      ],
      requestedAmount: [
        _refund != null ? _refund.requestedAmount : _refund,
        null,
      ],
      reason: [_refund != null ? _refund.refundReason : _refund, null],
      requestedDate: [_refund != null ? _refund.requestDate : _refund, null],
      status: [_refund != null ? _refund.status : _refund, null],
      refundStatus: [_refund != null ? _refund.refundStatus : _refund, null],
      approvedAmount: [
        _refund != null ? _refund.approvedAmount : _refund,
        null,
      ],
      refundRejectionReason: [
        _refund != null ? _refund.rejectedReason : _refund,
        null,
      ],
      resolutionRemarks: [
        _refund != null ? _refund.refundDetails : _refund,
        null,
      ],
      refundID: [_refund != null ? _refund.refundId : _refund, null],
      transactionID: [_refund != null ? _refund.transactionId : _refund, null],
      detailsTitleProperty: detailsTitle,
      refund: _refund,
    })
  }

  ngOnInit() {
    this.clearForm()
    this.refundsArray = this.serviceData.getSelectedData()
    if (this.refundsArray != null) {
      for (let i = 0; this.refundsArray.length > i; i++) {
        this.modifyOLPRefundsForm(this.form, this.refundsArray[i])
      }
    }
  }

  clearForm() {
    this.form.controls.refunds = this.fb.array([])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
