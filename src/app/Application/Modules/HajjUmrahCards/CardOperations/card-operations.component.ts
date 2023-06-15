import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { PagedData } from '../../../Model/paged-data'
import { CardOpeartionsService } from './card-opeartions.service'
import { AbstractWizardComponent } from '../../Common/Components/Abstract/abstract-wizard.component'
import { Step1Component } from './components/Step1/step1.component'
import { Step2Component } from './components/Step2/step2.component'
import { CardOperationsEntityService } from './card-opeartions-entity.service'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-card-operations',
  templateUrl: './card-operations.component.html',
  styleUrls: ['./card-operations.component.scss'],
})
export class CardOperationsComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  step1: Step1Component
  step2: Step2Component
  wizardStepsCount = 3
  form: FormGroup

  listFilesPage: PagedData<any>
  currentComponent: any
  wizardStep: any
  step: any
  authorizeSubscription: Subscription
  service: any
  requestValidate: RequestValidate

  constructor(
    public translate: TranslateService,
    public fb: FormBuilder,
    public cardOpeartionsService: CardOpeartionsService,
    private serviceData: CardOperationsEntityService,
    public router: Router,
  ) {
    super(fb, translate, router)
    this.requestValidate = new RequestValidate()
    this.form = fb.group({
      cardOperations: fb.array([]),
    })
  }

  ngOnInit() {
    super.ngOnInit()
  }

  onInitStep(step, events) {
    switch (step) {
      case 1:
        this.step1 = events
        break
      case 2:
        this.step2 = events
        break
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  isDisabled() {
    return true
  }

  validOTP() {
    return (
      this.serviceData.getSelectedData().generateChallengeAndOTP &&
      (!this.requestValidate.otp || this.requestValidate.otp.length == 0)
    )
  }

  valid() {
    return true
  }

  clearForm() {
    this.form.controls.cardOperations = this.fb.array([])
  }

  back() {
    this.wizardStep--
    this.router.navigate([
      '/hajjandumrahcards/cardoperation//step' + this.wizardStep,
    ])
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.serviceData.setData(
          this.step1.child.operation.selectedOptions[0].text,
        )
        this.cardOpeartionsService
          .authorizeValidate(
            this.serviceData.getSelectedData(),
            this.step1.child.operation.value,
          )
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
            } else {
              this.validationResponse = result
              this.clearForm()
              this.serviceData.setSelectedData(result)
              this.markNextWizardStep()
            }
          })
        break
      case 2:
        this.cardOpeartionsService
          .authorizeConfirm(
            this.serviceData.getSelectedData().batchDTO,
            this.serviceData.getSelectedData().operationType,
            this.form.controls.cardOperations,
            this.requestValidate,
          )
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
              // this.generateChallengeAndOTP= result.generateChallengeAndOTP;

              this.requestValidate = new RequestValidate()
            } else {
              this.validationResponse = result
              this.serviceData.tableSelectedRows = []
              this.markNextWizardStep()
            }
          })
        break
      case 3:
        this.finish()
        break
    }
  }

  previous() {
    this.markPreviousWizardStep()
  }

  finish() {
    this.wizardStep = 1
  }

  getWizardStepsCount() {
    return this.wizardStepsCount
  }

  isValid() {
    return (
      this.form.controls.cardOperations &&
      !this.form.controls.cardOperations.valid
    )
  }
}
