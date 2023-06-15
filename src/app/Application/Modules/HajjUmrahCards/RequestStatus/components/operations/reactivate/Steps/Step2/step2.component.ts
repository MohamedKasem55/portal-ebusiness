import {
  Component,
  OnInit,
  OnDestroy,
  EventEmitter,
  Output,
  Input,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'
import { AuthenticationService } from '../../../../../../../../../core/security/authentication.service'
import { CardOperationsReactivateEntityService } from '../../card-operations-reactivate-entity.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  selector: 'app-card-operation-reactivate-step2',
  templateUrl: './step2.component.html',
})
export class Step2Component implements OnInit, OnDestroy {
  @Output() onInit = new EventEmitter<Component>()
  @Input() action: string

  requestValidate: RequestValidate
  generateChallengeAndOTP: ResponseGenerateChallenge
  futureSecurityLevels: []

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
    private serviceData: CardOperationsReactivateEntityService,
  ) {
    this.requestValidate = new RequestValidate()
  }

  ngOnInit() {
    this.futureSecurityLevels =
      this.serviceData.getSelectedData().selectedOperation.securityLevelsDTOList
    this.generateChallengeAndOTP =
      this.serviceData.getSelectedData().generateChallengeAndOTP
    this.onInit.emit(this as Component)
  }

  ngOnDestroy() {}
}
