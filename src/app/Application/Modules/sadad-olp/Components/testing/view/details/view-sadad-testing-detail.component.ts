import { Component, OnInit, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder, FormGroup } from '@angular/forms'

import { AbstractAppComponent } from '../../../../../Common/Components/Abstract/abstract-app.component'
import { AuthenticationService } from '../../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../../Common/Services/static.service'
import { ManageTestingOLPEntityService } from './view-sadad-testing-entity.service'

@Component({
  selector: 'app-view-testing-detail',
  templateUrl: './view-sadad-testing-detail.component.html',
  styleUrls: ['./view-sadad-testing-detail.component.scss'],
})
export class ViewSadadTestingDetailComponent
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  form: FormGroup
  selectedTest: any

  constructor(
    public fb: FormBuilder,
    public serviceData: ManageTestingOLPEntityService,
    public translate: TranslateService,
    public staticService: StaticService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(translate)
    this.form = this.fb.group({
      testRqId: [null],
      bopVersion: [null],
      requestedDate: [null],
      status: [null],
    })
  }

  initTestingDetailForm(testDetail: any) {
    this.form = this.fb.group({
      testRqId: [testDetail != null ? testDetail.testRqId : testDetail],
      bopVersion: [testDetail != null ? testDetail.bopVersion : testDetail],
      requestedDate: [
        testDetail != null ? testDetail.requestedDate : testDetail,
      ],
      status: [testDetail != null ? testDetail.status : testDetail],
    })
  }

  ngOnInit() {
    super.ngOnInit()
    this.selectedTest = this.serviceData.getSelectedData()
    this.initTestingDetailForm(this.selectedTest)
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
