import { Location } from '@angular/common'
import { Component, Input, OnDestroy, OnInit, ViewChild  } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
// Import Directive to validate IBAN account
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { StaticService } from '../../../Common/Services/static.service'
// Import required to work with a shared data model.
import { FormData } from '../../Model/shared-form-Data.model'
// General service to optain static data
import { BeneficiariesFormData } from '../../Services/beneficiaries-form-data.service'
import { BeneficiariesGlobalService } from '../../Services/beneficiaries-global.service'
import { FormDataService } from '../../Services/shared-form-data.service'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'

@Component({
  templateUrl:
    '../../View/add-local-beneficiary/add-step2-local-beneficiary.html',
})
export class AddStep2LocalBeneficiary implements OnInit, OnDestroy {
  @Input() formData: FormData
  model: any
  banksCode: string[] = []
  errorAccountValidation = false

  sharedData: any = {}
  generateChallengeAndOTP: ResponseGenerateChallenge
  @ViewChild('account') account: any

  constructor(
    public formDataService: FormDataService,
    public comboDataBeneficiaries: BeneficiariesFormData,
    public beneficiariesGlobalService: BeneficiariesGlobalService,
    public staticService: StaticService,
    public _location: Location,
    private route: ActivatedRoute,
    public router: Router,
    public translate: TranslateService,
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['back']) {
        this.sharedData['back'] = params['back']
        this.sharedData['backType'] = 'LOCAL'
      }
    })
    // -----------------------------------------------------------------------------------
    // CARGA DE LOS DATOS ESTATICOS DE LOS COMBOS DEL FORMUALRIO  */

    this.formData = this.formDataService.getData()
    if (!this.formData.account) {
      this.formData.account = 'SA'
    }
    this.errorAccountValidation = this.formData.invalidIBAN

    // Creo un array de strings con los datos de los combos que voy a necesitar en el modulo Accounts
    this.refreshData()
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.refreshData()
    })
    setTimeout(() => (this.setIBAN()), 500,)
  }

  setIBAN() {
    if (localStorage.getItem('RTP_Beneficiary_IBAN')) {
        this.formData.account = localStorage.getItem('RTP_Beneficiary_IBAN')
        this.focusOutIbanAccount(this.formData.account)
        this.account.control.markAsTouched()
        localStorage.removeItem('RTP_Beneficiary_IBAN')
    }
  }

  refreshData() {
    const combosSolicitados = ['bankCode']

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.banksCode = data[combosSolicitados.indexOf('bankCode')]['values']
        this.focusOutIbanAccount(this.formData.account)
      })
  }

  ngOnDestroy() {
    this.formDataService.setData(this.formData)
    this.formDataService.setSharedData(this.sharedData)
  }

  focusOutIbanAccountEvent(event): void {
    if (event) {
      this.focusOutIbanAccount(event.value)
    }
  }

  focusOutIbanAccount(value: string): void {
    const bankIbanCodeTmp = value.substring(4, 6)
    const bankIbanCode = '0' + bankIbanCodeTmp
    this.formData.bankIbanCode = bankIbanCode
    this.formData.bankName = this.banksCode[bankIbanCode]
  }

  focusInIbanAccount(target): void {
    if (!target || !target.value || target.value.length == 0) {
      this.formData.account = 'SA'
    }
  }

  sendDetailLocalBeneficiary(): void {
    this.beneficiariesGlobalService
      .validateOrAddLocalBeneficiary(
        this.formData.account,
        this.formData.bankName,
        this.formData.beneficiaryName,
        this.formData.phoneNumber,
        this.formData.email,
        this.formData.phoneNumber,
        this.formData.bankIbanCode,
        this.sharedData,
      )
      .subscribe((result) => {
        this.generateChallengeAndOTP = result['generateChallengeAndOTP']
        this.sharedData['beneficiary'] = result['beneficiary']
        this.sharedData['generateChallengeAndOTP'] =
          this.generateChallengeAndOTP
        this.sharedData['aproveFlow'] = true
        this.sharedData['requestValidate'] = {}
        this.formDataService.setSharedData(this.sharedData)

        const msgResp = result['errorResponse']['englishMessage']

        if(msgResp == 'The beneficiary already exists'){
          this.router.navigate(['beneficiaries/beneficiaryList'])
        }else {
          this.router.navigate(['/beneficiaries/LocalBeneficiary/AddStep3'])
        }
        //
      })
  }

  goBack() {
    this.router.navigate(['/beneficiaries/AddBeneficiaries'])
  }
}
