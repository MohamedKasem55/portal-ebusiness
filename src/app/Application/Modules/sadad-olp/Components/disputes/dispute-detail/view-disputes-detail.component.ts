import { Component, OnInit, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'

import { AbstractAppComponent } from '../../../../Common/Components/Abstract/abstract-app.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { ManageOLPDisputeEntityService } from '../olp-disputes-entity.service'

@Component({
  selector: 'app-disputes-detail',
  templateUrl: './view-disputes-detail.component.html',
  styleUrls: ['./view-disputes-detail.component.scss'],
})
export class DisputesDetailComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  form: FormGroup
  selectedDispute: any

  constructor(
    public fb: FormBuilder,
    public serviceData: ManageOLPDisputeEntityService,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(translate)
    this.form = this.fb.group({
      disputeId: [null],
      transactionID: [null],
      categoryDesc: [null],
      transactionAmount: [null],
      requestDate: [null],
      status: [null],
      details: [null],
      assignedTo: [null],
    })
  }

  initTestingDetailForm(disputeDetail: any) {
    this.form = this.fb.group({
      disputeId: [
        disputeDetail != null ? disputeDetail.disputeId : disputeDetail,
      ],
      transactionID: [
        disputeDetail != null ? disputeDetail.transactionID : disputeDetail,
      ],
      categoryDesc: [
        disputeDetail != null ? disputeDetail.categoryDesc : disputeDetail,
      ],
      transactionAmount: [
        disputeDetail != null ? disputeDetail.transactionAmount : disputeDetail,
      ],
      requestDate: [
        disputeDetail != null ? disputeDetail.requestDate : disputeDetail,
      ],
      status: [disputeDetail != null ? disputeDetail.status : disputeDetail],
      details: [disputeDetail != null ? disputeDetail.details : disputeDetail],
      assignedTo: [
        disputeDetail != null ? disputeDetail.assignedTo : disputeDetail,
      ],
    })
  }

  ngOnInit() {
    super.ngOnInit()
    this.selectedDispute = this.serviceData.getSelectedData()
    this.initTestingDetailForm(this.selectedDispute)
  }

  back() {
    return this.router.navigate(['/sadadOLP/olp-disputes'])
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
