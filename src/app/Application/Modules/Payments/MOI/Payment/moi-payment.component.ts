import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { AuthenticationService } from '../../../../../core/security/authentication.service'
import { SecuredAuthentication } from '../../../../Components/secured-authentication/secured-authentication.component'
import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { StaticService } from '../../../Common/Services/static.service'
import { MOI_PAYMENTS_FORMS_FIELDS_CONFIGS } from './moi-payment.form-fields-configs'
import { MoiPaymentService } from './moi-payment.service'
import { MoiPaymentStep1Component } from './Steps/Step1/moi-payment-step1.component'
import { MoiPaymentStep2Component } from './Steps/Step2/moi-payment-step2.component'
import { MoiPaymentStep3Component } from './Steps/Step3/moi-payment-step3.component'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'

@Component({
  selector: 'app-moi-payment',
  templateUrl: './moi-payment.component.html',
  styleUrls: ['./moi-payment.component.scss'],
})
export class MoiPaymentComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  @ViewChild(MoiPaymentStep1Component)
  step1: MoiPaymentStep1Component
  @ViewChild(MoiPaymentStep2Component)
  step2: MoiPaymentStep2Component
  @ViewChild(MoiPaymentStep3Component)
  step3: MoiPaymentStep3Component

  formData: any

  combosData: any

  fieldsConfigs: any

  MOI_PAYMENTS_FORMS_FIELDS_CONFIGS: any = MOI_PAYMENTS_FORMS_FIELDS_CONFIGS

  preparedData: any
  batchList: any

  @ViewChild(SecuredAuthentication)
  authorization: SecuredAuthentication

  generateChallengeAndOTP: ResponseGenerateChallenge = null
  requestValidate: RequestValidate

  //-----------------------------------------------------------------------

  constructor(
    public fb: FormBuilder,
    public service: MoiPaymentService,
    public staticService: StaticService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, router)
    this.requestValidate = new RequestValidate()
    this.preparedData = []
    this.batchList = {}

    this.combosData = {
      servicesTypes: [],
      applicationsTypes: [],
      accounts: [],
      applicationsTypesAllCombosKey: [],
      eGovCategory: [],
    }

    this.fieldsConfigs = []

    this.formData = {}

    this.formModel = this.fb.group({
      serviceType: ['000', Validators.required],
      applicationType: ['', Validators.required],
      account: ['', Validators.required],
    })
  }

  ngOnInit() {
    super.ngOnInit()

    this.requestValidate = new RequestValidate()

    this.subscriptions.push(
      this.service.init({}).subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.wizardStep = 1

          this.combosData['applicationsTypesAllCombosKey'] =
            this.getCombosDatasKeysForApplicationTypes()

          const combosKeys = ['eGovSadadType']
            .concat(this.getCombosDatasKeysForApplicationTypesAsArray())
            .concat(this.getSelectTypeFieldsCombosKeys())
            .concat(this.getOthersCombosKeysToBeLoaded())
            .filter((value, index, self) => {
              return self.indexOf(value) === index
            })

          this.subscriptions.push(
            this.staticService
              .getAllCombosAsArrays(combosKeys, true)
              .subscribe((resultC) => {
                if (resultC === null) {
                  this.onError(resultC)
                } else {
                  const data: any = resultC
                  // tslint:disable-next-line:prefer-for-of
                  for (let i = 0; i < combosKeys.length; i++) {
                    this.combosData[combosKeys[i]] = data[combosKeys[i]]
                  }
                  this.combosData['servicesTypes'] =
                    this.combosData['eGovSadadType']
                }
              }),
          )

          this.subscriptions.push(
            this.service.accountsDTO({}).subscribe((result3) => {
              if (result3 === null) {
                this.onError(result3)
              } else {
                this.combosData['accountsLoaded'] = result3.listAccount.filter(
                  (account) => account['currency'] == 608,
                )
              }
            }),
          )
        }
      }),
    )

    this.subscriptions.push(
      this.formModel.get('serviceType').valueChanges.subscribe((value: any) => {
        const selectedServiceType = value
        this.combosData['applicationsTypes'] =
          this.getComboDataForApplicationsTypesBySelectedService(
            selectedServiceType,
          )
        this.formModel.get('applicationType').setValue(null)
        this.fieldsConfigs = []
        this.combosData['accounts'] = []
        this.formModel.get('account').setValue(null)
      }),
    )

    this.subscriptions.push(
      this.formModel
        .get('applicationType')
        .valueChanges.subscribe((value: any) => {
          if (value !== null && value !== '' && value !== undefined) {
            this.fieldsConfigs = this.getExtraFormFieldsConfigs({
              serviceType: this.formModel.get('serviceType').value,
              applicationType: this.formModel.get('applicationType').value,
            })
            this.combosData['accounts'] = this.combosData['accountsLoaded']
          } else {
            this.fieldsConfigs = []
            this.combosData['accounts'] = []
            this.formModel.get('account').setValue(null)
          }
        }),
    )
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  getWizardStepsCount() {
    this.wizardStepsCount = 3
    return this.wizardStepsCount
  }

  onInitStep(step, events) {
    switch (step) {
      case 1:
        this.step1 = events
        break
      case 2:
        this.step2 = events
        break
      case 3:
        this.step3 = events
        break
    }
  }

  isPreviousAllowed(): boolean {
    return (
      super.isPreviousAllowed() &&
      this.authenticationService.activateOption(
        'MOIPayment',
        ['EGOVERNMENT_PRIVILEGE'],
        ['EgovGroup'],
      )
    )
  }

  isNextAllowed(): boolean {
    return (
      super.isNextAllowed() &&
      this.authenticationService.activateOption(
        'MOIPayment',
        ['EGOVERNMENT_PRIVILEGE'],
        ['EgovGroup'],
      )
    )
  }

  isFinishAllowed(): boolean {
    return (
      super.isFinishAllowed() &&
      this.authenticationService.activateOption(
        'MOIPayment',
        ['EGOVERNMENT_PRIVILEGE'],
        ['EgovGroup'],
      )
    )
  }

  previous() {
    this.formModel.enable()
    this.markPreviousWizardStep()
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        const pdBatchList = []
        this.preparedData.forEach((pd) => {
          pdBatchList.push(pd.batch)
        })
        this.subscriptions.push(
          this.service
            .step(1, {
              batchList: pdBatchList,
            })
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.onError(result)
              } else {
                this.batchList = result.batchList
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirm({
              batchList: this.batchList,
              requestValidate: this.requestValidate,
            })
            .subscribe((result) => {
              if (result['errorCode'] !== '0') {
                this.requestValidate = new RequestValidate()
                this.generateChallengeAndOTP = result.generateChallengeAndOTP
                this.onError(result)
              } else {
                this.confirmResponse = result
                this.confirmResponse['BatchListsContainerSPProcessed'] = this
                  .batchList['toProcess']
                  ? this.batchList['toProcess']
                  : []
                this.markNextWizardStep()
              }
            }),
        )
        break
      case 3:
        this.finish()
        break
    }
  }
  test(paymentData,result){
/*     let obj={}
    for(let [key,value] of Object.entries(result.batch)){
      obj[key]=value

    } */
    for(let el of result.fees){
    paymentData.fieldsConfigs.push({
      key: el['feeType'],
      title: el['feeType'],
      translate: el['feeType'],
      type: 'text',
      required: true,
      default: el['feeAmount'],
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    }

  }
  onAddPaymentToPrepareData(event) {
    if (event) {
      this.formData = Object.assign({}, this.formModel.value)
        let result={batch:{beneficiaryName:"mohamed aboelkasem",amount:50,unusedBalance:10},fees:[{feeType: "Human resource fees",feeAmount: 1275.00},{feeType: "Human resource fees",feeAmount: 1275.00},{feeType: "Human resource fees",feeAmount: 1275.00},{feeType: "Human resource fees",feeAmount: 1275.00}]}
        const paymentData = {
          formData: this.formData,
          formModel: this.fb.group({}),
          fieldsConfigs: JSON.parse(JSON.stringify(this.fieldsConfigs)),
          batch: result.batch,
        }
        console.log(paymentData);
        
        this.test(paymentData,result)
        console.log(paymentData);
        paymentData.formData['beneficiaryName'] =
          result.batch['beneficiaryName']
        paymentData.fieldsConfigs.push({
          key: 'beneficiaryName',
          title: 'beneficiary Name',
          translate: 'beneficiaryName',
          type: 'text',
          required: true,
          default: result.batch['beneficiaryName'],
          validators: [],
          widget: '',
          widget_container_class: 'col-xs-12 col-sm-3',
          widget_container_init_row: false,
          widget_container_end_row: false,
        })
        
        paymentData.formData['amount'] = result.batch['amount']
        paymentData.fieldsConfigs.push({
          key: 'amount',
          title: 'amount',
          translate: 'amount',
          type: 'text',
          required: true,
          default: result.batch['amount'],
          validators: [],
          widget: '',
          widget_container_class: 'col-xs-12 col-sm-3',
          widget_container_init_row: false,
          widget_container_end_row: false,
        })

        paymentData.formData['unusedBalance'] =
          result.batch['unusedBalance']
        paymentData.fieldsConfigs.push({
          key: 'unusedBalance',
          title: 'Unused Balance',
          translate: 'unusedBalance',
          type: 'text',
          required: true,
          default: result.batch['unusedBalance'],
          validators: [],
          widget: '',
          widget_container_class: 'col-xs-12 col-sm-3',
          widget_container_init_row: false,
          widget_container_end_row: false,
        })
        paymentData.fieldsConfigs.forEach((cf) => {
          cf.required = false
          cf.disabled = true
          cf.validators = []
          cf.default = this.formData[cf.key] ? this.formData[cf.key] : ''
        })
        this.preparedData.push(paymentData)
        console.log(this.preparedData)
        this.formModel.get('serviceType').setValue('000')
        //this.formModel.get('applicationType').setValue('-');
        this.formModel.get('account').setValue(null)
        this.combosData['accounts'] = []
      
/*       this.subscriptions.push(
        this.service
          .step(0, {
            serviceType: this.formData['serviceType'],
            applicationType: this.formData['applicationType'],
            account: this.combosData['accounts'][this.formData['account']],
            apiKey: this.getServiceAndApplicationTypeApiKey({
              serviceType: this.formData['serviceType'],
              applicationType: this.formData['applicationType'],
            }),
            data: this.formData,
          })
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
            } else {
              const paymentData = {
                formData: this.formData,
                formModel: this.fb.group({}),
                fieldsConfigs: JSON.parse(JSON.stringify(this.fieldsConfigs)),
                batch: result.batch,
              }

              paymentData.formData['beneficiaryName'] =
                result.batch['beneficiaryName']
              paymentData.fieldsConfigs.push({
                key: 'beneficiaryName',
                title: 'beneficiary Name',
                translate: 'beneficiaryName',
                type: 'text',
                required: true,
                default: result.batch['beneficiaryName'],
                validators: [],
                widget: '',
                widget_container_class: 'col-xs-12 col-sm-3',
                widget_container_init_row: false,
                widget_container_end_row: false,
              })
              paymentData.formData['amount'] = result.batch['amount']
              paymentData.fieldsConfigs.push({
                key: 'amount',
                title: 'amount',
                translate: 'amount',
                type: 'text',
                required: true,
                default: result.batch['amount'],
                validators: [],
                widget: '',
                widget_container_class: 'col-xs-12 col-sm-3',
                widget_container_init_row: false,
                widget_container_end_row: false,
              })

              paymentData.formData['unusedBalance'] =
                result.batch['unusedBalance']
              paymentData.fieldsConfigs.push({
                key: 'unusedBalance',
                title: 'Unused Balance',
                translate: 'unusedBalance',
                type: 'text',
                required: true,
                default: result.batch['unusedBalance'],
                validators: [],
                widget: '',
                widget_container_class: 'col-xs-12 col-sm-3',
                widget_container_init_row: false,
                widget_container_end_row: false,
              })
              paymentData.fieldsConfigs.forEach((cf) => {
                cf.required = false
                cf.disabled = true
                cf.validators = []
                cf.default = this.formData[cf.key] ? this.formData[cf.key] : ''
              })
              this.preparedData.push(paymentData)

              this.formModel.get('serviceType').setValue('000')
              //this.formModel.get('applicationType').setValue('-');
              this.formModel.get('account').setValue(null)
              this.combosData['accounts'] = []
            }
          }),
      ) */
    } else {
      this.formModel.get('serviceType').setValue('000')
      this.formModel.get('account').setValue(null)
      this.combosData['accounts'] = []
    }
  }

  valid() {
    return true
  }

  isDisabled() {
    let enabled = true
    switch (this.wizardStep) {
      case 1:
        enabled = this.preparedData.length > 0
        break
      case 2:
        enabled = this.valid()
        if (this.generateChallengeAndOTP === null) {
          enabled = true
        } else {
          enabled = this.authorization ? this.authorization.valid() : true
        }
        break
      default:
        break
    }
    return !enabled
  }

  back() {
    this.formModel.reset()
    this.wizardStep = 1
    this.generateChallengeAndOTP = null
    this.requestValidate = new RequestValidate()
    this.ngOnInit()
    //this.router.navigate(['/credit-cards/details']);
  }

  finish() {
    super.finish()
    this.preparedData = []
    this.batchList = null
    //this.service.clearData();
    this.formModel.reset()
    this.wizardStep = 1
    this.ngOnInit()
    //this.router.navigate(['/credit-cards/details']);
  }

  getOthersCombosKeysToBeLoaded(): string[] {
    return []
  }

  getCombosDatasKeysForApplicationTypesAsArray(): string[] {
    const applicationsTypesAllCombosKey =
      this.getCombosDatasKeysForApplicationTypes()

    const keys = Object.keys(applicationsTypesAllCombosKey)

    const list = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < keys.length; i++) {
      list.push(applicationsTypesAllCombosKey[keys[i]])
    }
    return list
  }

  getCombosDatasKeysForApplicationTypes(): any {
    const applicationsTypesAllCombosKey = {
      '': 'eGovApplicationTypeAll', // All
      '095': 'eGovLaborImportationApp', //"VisaService",
      '092': 'eGovSaudiPassportsApp', //"SaudiPassport",
      '091': 'eGovDrivingLicenseApp', //"DrivingLicense",
      '096': 'eGovCivilRegistrationApp', //"CivilRegistration",
      '158': 'eGovCivilDefenseViolationsApp', //"CivilDefenseViolations",
      '090': 'eGovAlienControlApp', //"AlienControl",
      '094': 'eGovMotorVehiclesApp', //"MotorVehicles",
      '093': 'eGovTrafficViolationsApp', //"TrafficViolations"
      '126': 'eGovNationalViolationsApp', //"TrafficViolations"
    }

    return applicationsTypesAllCombosKey
  }

  getComboDataForApplicationsTypesBySelectedService(serviceType): any[] {
    const applicationsTypesAllCombosKey =
      this.getCombosDatasKeysForApplicationTypes()

    const applicationsTypesComboKey =
      serviceType && applicationsTypesAllCombosKey[serviceType]
        ? applicationsTypesAllCombosKey[serviceType]
        : null

    return applicationsTypesComboKey &&
      this.combosData[applicationsTypesComboKey]
      ? this.combosData[applicationsTypesComboKey]
      : []
  }

  getSelectTypeFieldsCombosKeys(): string[] {
    const combosKeys = {}
    const servicesTypes = Object.keys(this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS)
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < servicesTypes.length; i++) {
      const applicationsTypes = Object.keys(
        this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[servicesTypes[i]]
          .applicationsTypes,
      )
      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < applicationsTypes.length; j++) {
        const fields =
          this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[servicesTypes[i]]
            .applicationsTypes[applicationsTypes[j]].fieldsConfigs
        for (let k = 0; k < fields.length; k++) {
          const field =
            this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[servicesTypes[i]]
              .applicationsTypes[applicationsTypes[j]].fieldsConfigs[k]
          if (
            field['type'] == 'select' &&
            field['select_combo_key'] != '' &&
            !this.combosData[field['select_combo_key']]
          ) {
            combosKeys[field['select_combo_key']] = field['select_combo_key']
          }
        }
      }
    }

    return Object.keys(combosKeys)
  }

  //----------------------------------------------------------------

  getExtraFormFieldsConfigs(values: any): any[] {
    let fieldsConfigs =
      values.serviceType &&
      values.applicationType &&
      this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType] &&
      this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType]
        .applicationsTypes[values.applicationType]
        ? this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType]
            .applicationsTypes[values.applicationType].fieldsConfigs
        : null

    if (!fieldsConfigs) {
      const servicesIDs = Object.keys(this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS)
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < servicesIDs.length; i++) {
        const serviceDef =
          this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[servicesIDs[i]]
        const transactionsIDs = Object.keys(serviceDef.applicationsTypes)
        if (transactionsIDs.indexOf(values.applicationType) >= 0) {
          fieldsConfigs =
            serviceDef.applicationsTypes[values.applicationType].fieldsConfigs
          break
        }
      }
    }
    return fieldsConfigs ? fieldsConfigs : []
  }

  getServiceAndApplicationTypeApiKey(values: any): string {
    const apiKey =
      values.serviceType &&
      this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType]
        ? this.MOI_PAYMENTS_FORMS_FIELDS_CONFIGS[values.serviceType].apiKey
        : null
    return apiKey
  }
}
