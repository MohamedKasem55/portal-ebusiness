import { Component, OnInit, Input, OnDestroy } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { CardOperationsEntityService } from '../../card-opeartions-entity.service'
import { AbstractAppComponent } from '../../../../Common/Components/Abstract/abstract-app.component'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-cardOperations-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component
  extends AbstractAppComponent
  implements OnInit, OnDestroy
{
  operationType = ''
  operationTypeKey = ''
  generateChallengeAndOTP: ResponseGenerateChallenge
  expectedFees = 0

  @Input() form: FormGroup
  @Input() requestValidate: RequestValidate

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private serviceData: CardOperationsEntityService,
  ) {
    super(translate)
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.expectedFees = 0
    const data =
      this.serviceData.getSelectedData().batchDTO.toAuthorize.length > 0
        ? this.serviceData.getSelectedData().batchDTO.toAuthorize
        : this.serviceData.getSelectedData().batchDTO.toProcess
    for (const aux of data) {
      this.expectedFees += aux.expectedFees
    }
    this.operationTypeKey = this.serviceData.getSelectedData().operationType
    this.operationType = this.serviceData.getData()
    this.generateChallengeAndOTP =
      this.serviceData.getSelectedData().generateChallengeAndOTP
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  showAmountToProcess() {
    return this.operationTypeKey == 'LD'
  }

  showAmountToRefund() {
    return this.operationTypeKey == 'PR'
  }
}
