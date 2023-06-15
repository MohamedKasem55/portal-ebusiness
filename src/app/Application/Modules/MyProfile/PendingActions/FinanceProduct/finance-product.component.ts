import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { AbstractWizardComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-wizard.component'

import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { FinanceProductService } from './finance-product.service'

@Component({
  selector: 'finance-product',
  templateUrl: './finance-product.component.html',
  styleUrls: ['./finance-product.component.scss'],
})
export class FinanceProductComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy {
  public pageName: string = 'GRID'
  public pendingData: any = []
  public informationFormModel: FormGroup
  public generateChallengeAndOTP: ResponseGenerateChallenge
  public requestValidate: RequestValidate = new RequestValidate()
  public isRefuse: boolean = false
  private selectedRow: any = {}

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private financeProductService: FinanceProductService,
  ) {
    super(fb, translate, router)
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.financeProductService.getList().subscribe((result) => {
      if (result !== null) {
        result.forEach((element) => {
          element.currency = 'SAR'
        })
        this.pendingData = result
      }
    })
  }

  onInitStep(step: any, events: any) {}
  isDisabled() {}
  valid() {}
  back() {
    this.wizardStep--
  }
  next() {}
  getWizardStepsCount() {}

  canProceed() {
    if (this.wizardStep === 1) {
      return !this.informationFormModel.valid
    }
    if (this.wizardStep === 2) {
      return !this.requestValidate.valid()
    }
  }

  goDetails(row) {
    this.selectedRow = row
    this.pageName = 'STEPER'
    this.informationFormModel = this.financeProductService.createInformationForm(
      row,
    )
  }

  approved() {
    this.financeProductService.validat(this.selectedRow).subscribe((result) => {
      if (result !== null) {
        this.generateChallengeAndOTP = result.generateChallengeAndOTP
        this.wizardStep++
      }
    })
  }

  fialApproved() {
    this.financeProductService
      .confirm(this.selectedRow, this.requestValidate)
      .subscribe((result) => {
        if (result !== null) {
          this.wizardStep++
        }
      })
  }

  reject() {
    this.financeProductService.refuse(this.selectedRow).subscribe((result) => {
      if (result !== null) {
        this.isRefuse = true
        this.wizardStep = 3
      }
    })
  }
}
