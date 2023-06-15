import { Component, OnInit, ViewChild } from '@angular/core'
import { OpenAdditionalAccountService } from '../Services/open-additional-account.service'
import { takeUntil } from 'rxjs/operators'
import { StaticService } from '../../Common/Services/static.service'
import { Subject } from 'rxjs'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { AbstractWizardComponent } from '../../Common/Components/Abstract/abstract-wizard.component'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { openAdditionalAccountData } from '../../../Model/openAdditionalAccountData'
import { ConfigResourceService } from '../../../../core/config/config.resource.local'

@Component({
  selector: 'app-open-additional-account',
  templateUrl: './open-additional-account.component.html',
  styleUrls: ['./open-additional-account.component.scss'],
})
export class OpenAdditionalAccountComponent
  extends AbstractWizardComponent
  implements OnInit
{
  @ViewChild('accountModal', { static: true })
  public accountModal: ModalDirective

  combosSolicitados = ['openAccountCurrencyCodes', 'branchRbs5']
  relationTypeCode = 'CUR'
  currencies: any[]
  branches: any[]
  Reasons: any[]
  subcategory: any[]
  BranchExists: boolean
  Branch: any
  openAdditionalAccountData = new openAdditionalAccountData()
  destroy$: Subject<boolean> = new Subject<boolean>()
  formGroup: FormGroup
  accountNO: any
  accountIBAN: any

  constructor(
    private openAdditionalAccountService: OpenAdditionalAccountService,
    public staticService: StaticService,
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    public config: ConfigResourceService
  ) {
    super(fb, translate, router)
  }

  ngOnInit(): void {
    this.getEligibility()
    this.formGroup = this.fb.group({
      Currency: ['', [Validators.required]],
      Branch: ['', [Validators.required]],
      TC: ['', [Validators.required]],
    })
  }

  onInitStep(step, events) {}

  valid() {}

  refreshData() {
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .pipe(takeUntil(this.destroy$))
      .subscribe((comboData) => {
        const data = comboData
        this.currencies =
          data[this.combosSolicitados.indexOf('openAccountCurrencyCodes')][
            'values'
          ]
        this.branches =
          data[this.combosSolicitados.indexOf('branchRbs5')]['values']
      })
  }

  getEligibility() {
    this.openAdditionalAccountService
      .getEligibilityInquiry(this.relationTypeCode)
      .subscribe((res: any) => {
        if(res.errorCode == '0'){
          if (res.eligibilityFlg) {
            this.refreshData()
          } else {
            this.accountModal.show()
          }
          if (res.branch !== null) {
            this.BranchExists = true
            this.Branch = res.branch
            this.formGroup.controls['Branch'].patchValue(this.Branch.branchRbs5)
          }
        }
        else {
          this.cancel()
        }
      })
  }

  back() {
    super.previous()
  }

  getWizardStepsCount() {}

  isDisabled() {}

  next() {
    switch (this.wizardStep) {
      case 1:
        this.wizardStep += 1
        break
      case 2:
        this.validateAccount()
        break
      case 3:
        this.creatAccount()
        break
    }
  }

  getSubcategory(data: any) {
    this.openAdditionalAccountService
      .getsubcategoryInquiry(data)
      .subscribe((res: any) => {
        if (res.errorCode === '0') {
          this.subcategory = res.responseAccountSubcategoryItems
          this.wizardStep++
        }
      })
  }

  canProceed() {
    return !this.formGroup.valid
  }

  close() {
    this.accountModal.hide()
    this.router.navigate(['./'])
  }

  onBranchChange() {
    if (this.BranchExists === false) {
      this.formGroup.get('Branch').setValidators(Validators.required)
    } else {
      this.formGroup.get('Branch').setValidators(Validators.nullValidator)
    }
  }

  validateAccount() {
    this.openAdditionalAccountData.branchIdent = this.formGroup.value.Branch
    this.openAdditionalAccountData.currency = this.formGroup.value.Currency
    this.openAdditionalAccountData.acctType = this.relationTypeCode

    const data = this.openAdditionalAccountData
    this.openAdditionalAccountService.validateAccount(data).subscribe((res) => {
      this.validationResponse = res
      if (res.errorCode === '0') {
        this.wizardStep++
      }
    })
  }

  creatAccount() {
    this.openAdditionalAccountData.requestValidate = this.requestValidate
    this.openAdditionalAccountService
      .createAccount(this.openAdditionalAccountData)
      .subscribe((res) => {
        this.validationResponse = res
        if (res.errorCode === '0') {
          this.accountNO = res.acctNum
          this.accountIBAN = res.iban
          this.wizardStep++
        }
      })
  }

  cancel() {
    this.wizardStep = 1
    this.router.navigate(['./'])
  }

  termsAndConditions(): void {
    window.open(this.config.getDocumentUrl()+'/subaccount_new_terms_and_conditions.pdf')
  }
}
