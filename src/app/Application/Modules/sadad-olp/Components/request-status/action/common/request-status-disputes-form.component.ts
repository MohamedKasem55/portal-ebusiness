import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from 'app/core/security/authentication.service'
import { Subscription } from 'rxjs'
import { ManageRequestStatusDisputesEntityService } from '../../request-status-disputes-entity.service'

@Component({
  selector: 'app-request-status-disputes-form',
  templateUrl: './request-status-disputes-form.component.html',
})
export class RequestStatusDisputeFormComponent implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Input() readonly: boolean

  subscriptions: Subscription[] = []

  disputesArray: any

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private serviceData: ManageRequestStatusDisputesEntityService,
  ) {}

  modifyOLPDisputesForm(form: FormGroup, dispute: any) {
    const control = form.controls['disputes'] as FormArray
    control.push(this.initOLPDisputesForm(dispute))
  }

  get disputes(): FormGroup[] {
    return this.form.controls['disputes']['controls']
  }

  initOLPDisputesForm(_dispute: any) {
    const disputeId = 'sadadOLP.disputes.disputesId'
    const transactionId = 'sadadOLP.disputes.transactionId'
    let detailsTitle = ''
    this.subscriptions.push(
      this.translate.get(disputeId).subscribe((title) => {
        detailsTitle = title + ': ' + _dispute.disputeId
      }),
    )
    this.subscriptions.push(
      this.translate.get(transactionId).subscribe((title) => {
        detailsTitle =
          detailsTitle + ' - ' + title + ': ' + _dispute.transactionId
      }),
    )

    return this.fb.group({
      transactionAmount: [
        _dispute != null ? _dispute.transactionAmount : _dispute,
        null,
      ],
      transactionDate: [
        _dispute != null ? _dispute.transactionDate : _dispute,
        null,
      ],
      amount: [_dispute != null ? _dispute.amount : _dispute, null],
      categoryDescription: [
        _dispute != null ? _dispute.categoryDescription : _dispute,
        null,
      ],
      disputeStatus: [
        _dispute != null ? _dispute.disputeStatus : _dispute,
        null,
      ],
      status: [_dispute != null ? _dispute.status : _dispute, null],
      details: [_dispute != null ? _dispute.details : _dispute, null],
      rejectedReason: [
        _dispute != null ? _dispute.rejectedReason : _dispute,
        null,
      ],
      detailsTitleProperty: detailsTitle,
      dispute: _dispute,
    })
  }

  ngOnInit() {
    this.clearForm()
    this.disputesArray = this.serviceData.getSelectedData()
    if (this.disputesArray != null) {
      for (let i = 0; this.disputesArray.length > i; i++) {
        this.modifyOLPDisputesForm(this.form, this.disputesArray[i])
      }
    }
  }

  clearForm() {
    this.form.controls.disputes = this.fb.array([])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
