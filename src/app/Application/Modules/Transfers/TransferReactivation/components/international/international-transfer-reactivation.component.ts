import {
  Component,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core'
import { AbstractWizardComponent } from '../../../../Common/Components/Abstract/abstract-wizard.component'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { TransferReactivationService } from '../../transfer-reactivation.service'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { SecuredAuthentication } from '../../../../../Components/secured-authentication/secured-authentication.component'
import { TransferInternationalService } from '../../../Services/transfer-international.service'
import { Exception } from '../../../../../Model/exception'

@Component({
  selector: 'international-transfer-reactivation',
  templateUrl: './international-transfer-reactivation.component.html',
})
export class InternationalTransferReactivationComponent
  extends AbstractWizardComponent
  implements OnInit
{
  currentTransferBatchList: any[]
  currentAction: string
  confirmResponse: any
  segment: any
  requestValidate: any
  @ViewChild('authorization') authorization: SecuredAuthentication

  batches: any[] = []
  accounts: any[] = []
  beneficiaries: any[] = []
  forms: FormGroup[] = []
  formsFieldsConfigs: any[] = []

  transferReasons: any[] = []

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public router: Router,
    public service: TransferInternationalService,
    public reactivationService: TransferReactivationService,
    private storeservice: StorageService,
    @Inject(LOCALE_ID) private _locale: string,
    private injector: Injector,
  ) {
    super(fb, translate, router)
    const currentseg = this.storeservice.retrieve('welcome')
    this.segment = currentseg.segment
  }

  ngOnInit() {
    super.ngOnInit()
    this.validationResponse = null
    if (!this.reactivationService.currentTransactionDetailInformation) {
      this.cancel()
      return
    }
    this.beneficiaries =
      this.reactivationService.currentTransactionDetailInformation[
        'listBeneficiaries'
      ]
    this.batches =
      this.reactivationService.currentTransactionDetailInformation['batchList']
    this.accounts =
      this.reactivationService.currentTransactionDetailInformation[
        'accountList'
      ]

    if (
      this.beneficiaries &&
      this.beneficiaries[0] &&
      this.batches &&
      this.batches[0]
    ) {
      const remitterCategory = this.batches[0]['remitterCategory']
      this.subscriptions.push(
        this.service
          .transferPropose(this.beneficiaries[0], remitterCategory)
          .subscribe((_result: any) => {
            if (
              _result.hasOwnProperty('error') &&
              _result.error instanceof Exception
            ) {
              this.onError(_result)
              return
            } else {
              this.transferReasons = _result.transferReasonsList
              this.prepareForms()
            }
          }),
      )
    } else {
      this.prepareForms()
    }
  }

  prepareForms() {
    if (Array.isArray(this.batches) && this.forms.length == 0) {
      this.batches.forEach((batch, i) => {
        const formGroup = this.fb.group({})
        this.forms.push(formGroup)
        const formFieldsConfig =
          this.reactivationService.getInternationalDynamicFormFields(
            batch,
            this.beneficiaries && this.beneficiaries[i]
              ? this.beneficiaries[i]
              : null,
            this.accounts,
          )
        this.formsFieldsConfigs.push(formFieldsConfig)
      })
    }
  }

  back() {
    this.validationResponse = null
  }

  cancel() {
    this.reactivationService.currentTransactionDetailInformation = null
    this.reactivationService.currentTransferDetailType = ''
    this.router.navigateByUrl('/transfers/requestStatus')
  }

  getWizardStepsCount() {
    return 3
  }

  isDisabled() {
    if (this.wizardStep === 1) {
      let valid = true
      this.forms.forEach((form, i) => {
        valid = valid && form.valid
      })
      return !valid
    }
    return false
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        if (this.currentAction === 'DELETE') {
          this.validationResponse = {}
          this.markNextWizardStep()
        } else {
          const requestValidateData = this.getValidateRequestForInternational()
          this.reactivationService
            .createInternationalValidateRequest(requestValidateData)
            .subscribe((result) => {
              if (result.errorCode && result.errorCode === '0') {
                this.validationResponse = result
                this.markNextWizardStep()
              }
            })
        }
        break
      case 2:
        if (this.currentAction === 'DELETE') {
          this.reactivationService
            .createInternationalDeleteRequest(
              this.reactivationService.currentTransactionDetailInformation[
                'batchList'
              ],
            )
            .subscribe((result) => {
              if (result.errorCode && result.errorCode === '0') {
                this.markNextWizardStep()
              }
            })
        } else {
          const values = {
            batchList:
              this.validationResponse['checkAndSeparateInitiatitionPermission'],
            emailChecked: false,
            typeBatchList: this.reactivationService.currentTransferDetailType,
            requestValidate: this.requestValidate,
            totalAmountProcess: this.validationResponse['totalAmountProcess'],
            listbatchToDelete:
              this.reactivationService.currentTransactionDetailInformation[
                'batchList'
              ],
          }
          this.reactivationService
            .createInternationalConfirmRequest(values)
            .subscribe((result) => {
              if (result.errorCode && result.errorCode === '0') {
                this.markNextWizardStep()
              }
            })
        }
        break
      default:
        break
    }
  }

  initiate() {
    this.currentAction = 'INIT'
    this.next()
  }

  delete() {
    this.currentAction = 'DELETE'
    this.next()
  }

  onInitStep(step, events) {
    this.currentTransferBatchList =
      this.reactivationService.currentTransactionDetailInformation
  }

  valid() {
    return true
  }

  findAccount(accountFromNumber) {
    let accountDto = null
    this.reactivationService.currentTransactionDetailInformation[
      'accountList'
    ].forEach((element) => {
      if (element['fullAccountNumber'] === accountFromNumber) {
        accountDto = element
      }
    })
    return accountDto
  }

  getValidateRequestForInternational() {
    const requestData = {
      listBeneficiaries:
        this.reactivationService.currentTransactionDetailInformation[
          'listBeneficiaries'
        ],
      operationDate: new Date(),
      //"operationDate": new DateFormatPipe(this.injector, this._locale).transform(new Date(), "yyyy-MM-dd"),
      segment: this.segment,
      remitterCategory:
        this.reactivationService.currentTransactionDetailInformation[
          'remitterCategory'
        ],
      transferIntList: [],
    }
    // tslint:disable-next-line:prefer-for-of
    for (
      let i = 0;
      i <
      this.reactivationService.currentTransactionDetailInformation['batchList']
        .length;
      i++
    ) {
      const formData = this.forms[i].getRawValue()
      const account = this.accounts.find((element) => {
        return element['fullAccountNumber'] === formData['accountFrom']
      })
      formData['amount'] = parseFloat(
        ('' + formData['amount']).split(',').join(''),
      )
      formData['accountFrom'] = formData['accountFrom'] //account;
      formData['accountForm'] = formData['accountFrom'] //account;
      requestData['transferIntList'].push(formData)
      if (
        requestData['listBeneficiaries'] &&
        requestData['listBeneficiaries'][i]
      ) {
        requestData['listBeneficiaries'][i]['beneficiaryAccountFrom'] = account
        requestData['listBeneficiaries'][i]['beneficiaryAccountForm'] = account
      }
    }
    return requestData
  }

  finish() {
    this.reactivationService.currentTransactionDetailInformation = undefined
    this.reactivationService.currentTransactionDetailInformation = undefined
    this.router.navigate(['/transfers/requestStatus'])
  }
}
