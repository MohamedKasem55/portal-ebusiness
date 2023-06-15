import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { ManageOLPRefundEntityService } from '../refund-sadad-olp-entity.service'

@Component({
  selector: 'app-olp-refunds-form',
  templateUrl: './olp-refunds-form.component.html',
})
export class OLPRefundFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() title: string
  @Input() readonly: boolean
  @Input() actionsEnabled = false

  subscriptions: Subscription[] = []

  refundsArray: any

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private serviceData: ManageOLPRefundEntityService,
  ) {}

  modifyOLPRefundsForm(form: FormGroup, refund: any) {
    const control = form.controls['refunds'] as FormArray
    control.push(this.initOLPRefundsForm(refund))
  }

  get refunds(): FormGroup[] {
    return this.form.controls['refunds']['controls']
  }

  initOLPRefundsForm(refund: any) {
    const refundId = 'sadadOLP.refunds.refundId'
    const transactionId = 'sadadOLP.refunds.transactionId'
    let detailsTitle = ''
    this.subscriptions.push(
      this.translate.get(refundId).subscribe((title) => {
        detailsTitle = title + ': ' + refund.refundID
      }),
    )
    this.subscriptions.push(
      this.translate.get(transactionId).subscribe((title) => {
        detailsTitle =
          detailsTitle + ' - ' + title + ': ' + refund.transactionID
      }),
    )

    return this.fb.group({
      transactionAmount: [
        refund != null ? refund.transactionAmount : refund,
        null,
      ],
      transactionDate: [refund != null ? refund.transactionDate : refund, null],
      requestedAmount: [refund != null ? refund.requestedAmount : refund, null],
      reason: [refund != null ? refund.reason : refund, null],
      requestedDate: [refund != null ? refund.requestedDate : refund, null],
      status: [refund != null ? refund.status : refund, null],
      approvedAmount: [refund != null ? refund.approvedAmount : refund, null],
      refundRejectionReason: [
        refund != null ? refund.refundRejectionReason : refund,
        null,
      ],
      resolutionRemarks: [
        refund != null ? refund.resolutionRemarks : refund,
        null,
      ],
      refundID: [refund != null ? refund.refundID : refund, null],
      transactionID: [refund != null ? refund.transactionID : refund, null],
      detailsTitleProperty: detailsTitle,
      refund: refund != null ? refund : null,
    })
  }

  ngOnInit() {
    this.refundsArray = this.serviceData.getSelectedData()
    this.intitializeForms()
  }

  removeRefund(refundId: number) {
    if (this.refundsArray !== null) {
      const refundsArrayTemp = this.refundsArray.filter(
        (elem) => +elem['refundID'] !== +refundId,
      )
      this.refundsArray = refundsArrayTemp
      this.form.controls['refunds'] = this.fb.array([])
      this.intitializeForms()
    } else {
      const controls = this.form.controls['refunds']['controls'].filter(
        (elem) => {
          return +elem['controls']['refundID']['value'] !== +refundId
        },
      )
      this.form.controls['refunds'] = this.fb.array(controls)
    }
  }

  intitializeForms() {
    if (this.refundsArray != null) {
      for (let i = 0; this.refundsArray.length > i; i++) {
        this.modifyOLPRefundsForm(this.form, this.refundsArray[i])
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
