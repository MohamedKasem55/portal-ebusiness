import { take } from 'rxjs/operators'
import { Location } from '@angular/common'
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { PopoverDirective } from 'ngx-bootstrap/popover'
import { StaticService } from '../../../Common/Services/static.service'
import { AddInternationalBeneficiaryService } from '../../Services/add-international-beneficiaries.service'
// Interface countries
import { IPaises } from '../../Model/interface-countries'
// General service to optain static data
import { BeneficiariesFormData } from '../../Services/beneficiaries-form-data.service'
import { BeneficiariesGlobalService } from '../../Services/beneficiaries-global.service'
// Service to get countries, bank names and brach name
import { GetHostStaticData } from '../../Services/beneficiaries-host-static-data.service'
// Import required to work with a shared data model.
import { FormDataService } from '../../Services/shared-form-data.service'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { threadId } from 'worker_threads'

@Component({
  templateUrl:
    '../../View/add-international-beneficiary/add-step2-international-beneficiary.html',
})
export class AddStep2InternationalBeneficiary implements OnInit, OnDestroy {
  @Input() formData: any
  @ViewChild('popover') pop: PopoverDirective
  @ViewChild('popover2') pop2: PopoverDirective

  showDateBirth = false
  showDateIssued = false
  model: any
  countries: string[] = []
  banksNames: string[] = []
  branchs: string[] = []
  nationalities: string[] = []
  idTypes: string[] = []
  value: Date
  public category: any
  public IndividualFields = false
  currencyList: string[] = []
  swiftCode: string
  bankAddress: string
  branchAddress: string
  accountLength: string
  openBirthCalendar = true
  openIssueCalendar = true
  isBankAddressDisabled = true
  isBranchAddressDisabled = true
  selectedCurrency: any
  mandatoryFields: any[] = []
  today = new Date()

  arrayPaises: IPaises[] = []
  countryData

  sharedData: any = {}
  generateChallengeAndOTP: ResponseGenerateChallenge

  bsConfig: any

  form: FormGroup
  formNoChange: FormGroup

  dateFormat = 'yyyy-MM-dd'
  selectedCountry: any
  selectedBank: any
  isCountrySelected = false
  selectedTransferType: any
  selectedBranch: any
  isIndia = false
  isCountrySelection = true
  isSelectionDone = false
  lastSelectedSwift = null
  birthDate = new Date()
  isError = false

  constructor(
    public formDataService: FormDataService,
    public comboDataBeneficiaries: BeneficiariesFormData,
    public beneficiariesGlobalService: BeneficiariesGlobalService,
    public getHostStaticData: GetHostStaticData,
    public staticService: StaticService,
    public _location: Location,
    public fb: FormBuilder,
    public translate: TranslateService,
    private route: ActivatedRoute,
    public router: Router,
    private dateFormatPipe: DateFormatPipe,
    public addInternationalBeneficiaryService: AddInternationalBeneficiaryService,
  ) {
    this.model = {
      account: '',
      bankName: '',
      beneficiaryName: '',
      phoneNumber: '',
      email: '',
      category: '',
    }

    if (this.formDataService.getData()) {
      this.formData = this.formDataService.getData()
      const formDataBack = this.formDataService.getData()

      this.form = this.fb.group({
        bankName: formDataBack.bankName ? formDataBack.bankName : [''],
        country: formDataBack.country ? formDataBack.country : [''],
        branchName: formDataBack.branchName ? formDataBack.branchName : [''],
        currency: formDataBack.currency ? formDataBack.currency : [''],
        category: formDataBack.category ? formDataBack.category : [''],
        tranferType: [''],
      })

      if (formDataBack.dateBirth && this.formData) {
        this.formData.dateBirth = formDataBack.dateBirth
      }

      this.formNoChange = this.fb.group({
        placeBirth: formDataBack.placeBirth ? formDataBack.placeBirth : [''],
        nationality: formDataBack.nationality ? formDataBack.nationality : [''],
        individualIdType: formDataBack.individualIdType
          ? formDataBack.individualIdType
          : [''],
        countryIdType: formDataBack.countryIdType
          ? formDataBack.countryIdType
          : [''],
      })
    } else {
      this.form = this.fb.group({
        bankName: [''],
        country: [''],
        branchName: [''],
        currency: [''],
        category: [''],
        transferType: [''],
      })

      this.formNoChange = this.fb.group({
        placeBirth: [''],
        nationality: [''],
        individualIdType: [''],
        countryIdType: [''],
      })
    }
  }

  ngOnInit() {
    this.isValid()
    this.formData.selectionCriteria = 'countrySelection'
    this.formData.category = 'INDIVIDUAL'
    this.form.addControl('transferType', new FormControl(''))
    this.route.params.subscribe((params) => {
      if (params['back']) {
        this.sharedData['back'] = params['back']
        this.sharedData['backType'] = 'INTERNATIONAL'
      }
    })
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    // -----------------------------------------------------------------------------------
    // CARGA DE LOS DATOS ESTATICOS DE LOS COMBOS DEL FORMUALRIO  */
    this.formData = this.formDataService.getData()
    this.refreshData()
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.refreshData()
    })
    this.clearAllFields()
  }

  saveInternationalBeneficiary(enrada: any): void {
    this.formData.bankName = this.form.get('bankName').value
    this.formData.branchName = this.form.get('branchName').value

    this.formDataService.setData(this.formData)
    this.beneficiariesGlobalService
      .validateInternationalBeneficiary()
      .subscribe((result) => {
        if (result.errorCode === '0') {
          this.generateChallengeAndOTP = result['generateChallengeAndOTP']
          this.sharedData['beneficiary'] = result['beneficiary']
          this.sharedData['generateChallengeAndOTP'] =
            this.generateChallengeAndOTP
          this.sharedData['aproveFlow'] = true
          this.sharedData['requestValidate'] = {}
          this.formDataService.setSharedData(this.sharedData)
          this.router.navigate([
            '/beneficiaries/InternationalBeneficiary/AddStep3',
          ])
        }
      })
  }

  saveValidateInternationalBeneficiary(): void {
    if (this.selectedCountry.value == 'India') {
      if (
        this.formData.swiftCode.charAt(4) == 'I' &&
        this.formData.swiftCode.charAt(5) == 'N'
      ) {
        this.selectedBank.routingIndex = 'R'
      } else {
        this.selectedBank.routingIndex = 'B'
      }
    }
    const params: any = {
      benefAddress: this.form.controls['BeneficiaryAddress']
        ? this.form.controls['BeneficiaryAddress'].value
        : null,
      benefAddress2: this.form.controls['BeneficiaryAddress2']
        ? this.form.controls['BeneficiaryAddress2'].value
        : null,
      benefPOBox: this.form.controls['BeneficiaryPOBox']
        ? this.form.controls['BeneficiaryPOBox'].value
        : null,
      benefAddress4: this.form.controls['BeneficiaryAddress4']
        ? this.form.controls['BeneficiaryAddress4'].value
        : null,
      benefPostCode: this.form.controls['BeneficiaryZipCode']
        ? this.form.controls['BeneficiaryZipCode'].value
        : null,
      benefCity: this.form.controls['BeneficiaryCity']
        ? this.form.controls['BeneficiaryCity'].value
        : null,
      benefFirstName: this.form.controls['BeneficiaryFirstName']
        ? this.form.controls['BeneficiaryFirstName'].value
        : null,
      benefLastName: this.form.controls['BeneficiaryLastName']
        ? this.form.controls['BeneficiaryLastName'].value
        : null,
      benefNationality: this.form.controls['BeneficiaryNationality']
        ? this.form.controls['BeneficiaryNationality'].value
        : null,
      benefBankAcct: this.form.controls['BeneficiaryBankAcct']
        ? this.form.controls['BeneficiaryBankAcct'].value
        : null,
      beneficiaryBranchDtls: this.form.controls['BeneficiaryBranchDtls']
        ? this.form.controls['BeneficiaryBranchDtls'].value
        : null,
      benefMobileNum: this.form.controls['BeneficiaryMobileNum']
        ? this.form.controls['BeneficiaryMobileNum'].value
        : null,
      benefMobilePrefix: this.form.controls['BeneficiaryMobilePrefix']
        ? this.form.controls['BeneficiaryMobilePrefix'].value
        : null,
      benefBankIBAN: this.form.controls['BeneficiaryIBAN']
        ? this.form.controls['BeneficiaryIBAN'].value
        : null,
      beneficiaryIndianBankCtry: this.form.controls['BeneficiaryIndianBankCtry']
        ? this.form.controls['BeneficiaryIndianBankCtry'].value
        : null, //
      benefEmail: this.form.controls['BeneficiaryEmail']
        ? this.form.controls['BeneficiaryEmail'].value.toUpperCase()
        : null, // not sure
      benefSortCode: this.form.controls['BeneficiaryBankSortCode']
        ? this.form.controls['BeneficiaryBankSortCode'].value
            .replace(/-/g, '')
            .toUpperCase()
        : null,
      correspondantId: this.form.controls['CorrespIDNum']
        ? this.form.controls['CorrespIDNum'].value
        : null, // bankCode:
      benefBirthDate: this.form.controls['BeneficiaryBirthDate']
        ? this.form.controls['BeneficiaryBirthDate'].value
        : null, // "2018-11-04", mandatory
      benefBirthPlace: this.form.controls['BeneficiaryBirthPlace']
        ? this.form.controls['BeneficiaryBirthPlace'].value.toUpperCase()
        : null, // mandatory
      benefRelation: this.form.controls['RemitLinkTypeCode']
        ? this.form.controls['RemitLinkTypeCode'].value || ''
        : null, // dropdown relation
      benefCountyDistrict: this.form.controls['districtCode']
        ? this.form.controls['districtCode'].value
        : null,
      benefRegion: this.form.controls['region']
        ? this.form.controls['region'].value.toUpperCase().substring(0, 4)
        : null,
      benefFullName: this.form.controls['BeneficiaryFullName']
        ? this.form.controls['BeneficiaryFullName'].value
        : null,
      productType: 'PAY',
      serviceType: this.selectedTransferType,
      juridicalStatus: this.formData.category
        ? this.formData.category
        : 'COMPANY',
      category: this.formData.category === 'INDIVIDUAL' ? 'I' : 'C',

      benefCurrency: this.selectedCurrency.currencyISO
        ? this.selectedCurrency.currencyISO.toUpperCase()
        : null,
      benefCountry: this.selectedCountry.ISO ? this.selectedCountry.ISO : '',
      benefBankName: this.selectedBank.bankName
        ? this.selectedBank.bankName
        : '',
      benefBankId: this.selectedBank.bankCode ? this.selectedBank.bankCode : '',
      benefBranchCode: this.selectedBranch.beneficiaryBranchCAB
        ? this.selectedBranch.beneficiaryBranchCAB
        : null,
      benefBranchName: this.selectedBranch.beneficiaryBankBranch
        ?.toUpperCase()
        .substring(0, 40),
      routingBeneficiaryCode: this.selectedBranch.beneficiaryBranchCAB
        ? this.selectedBranch.beneficiaryBranchCAB
        : null, // branch cap
      benefBankCountry: this.selectedCountry.ISO
        ? this.selectedCountry.ISO
        : null,
      benefSWIFTCode: this.selectedBank.swiftCode.toUpperCase(),
      routingIndex: this.selectedBank.routingIndex,
      countryNumber: this.selectedCountry.key,
      requestValidate: {
        challengeNumber:
          this.sharedData.generateChallengeAndOTP &&
          'CHALLENGE' ==
            this.sharedData.generateChallengeAndOTP.typeAuthentication
            ? this.sharedData.requestValidate.challengeNumber
            : '',
        challengeResponse:
          this.sharedData.generateChallengeAndOTP &&
          'CHALLENGE' ==
            this.sharedData.generateChallengeAndOTP.typeAuthentication
            ? this.sharedData.requestValidate.challengeResponse
            : '',
        otp:
          this.sharedData.generateChallengeAndOTP &&
          'OTP' == this.sharedData.generateChallengeAndOTP.typeAuthentication
            ? this.sharedData.requestValidate.otp
            : '',
        password:
          this.sharedData.generateChallengeAndOTP &&
          'STATIC' == this.sharedData.generateChallengeAndOTP.typeAuthentication
            ? this.sharedData.requestValidate.password
            : '',
      },
    }
    const controls = this.form.controls
    const fields = []
    const mandatoryFields = this.mandatoryFields
    Object.keys(controls).forEach(function (key) {
      const result = mandatoryFields.find((obj) => obj.name === key)
      let fieldData = {}
      if (result && result.items && result.items.length != 0) {
        const item = result.items.find(
          (items) => items.key == controls[key].value,
        )
        if (result) {
          fieldData = {
            name: result.label,
            value: item.value,
          }
        } else {
          fieldData = {
            name: key,
            value: item.value,
          }
        }
      } else {
        if (result) {
          fieldData = {
            name: result.label,
            value: controls[key].value,
          }
        } else {
          fieldData = {
            name: key,
            value: controls[key].value,
          }
        }
      }

      if (
        key === 'bankName' ||
        key === 'branchName' ||
        key === 'category' ||
        key === 'country' ||
        key === 'currency' ||
        key === 'transferType' ||
        key === 'tranferType'
      ) {
        return
      }
      fields.push(fieldData)
    })
    this.formData.mandatoryControls = fields
    this.formDataService.setData(this.formData)
    this.beneficiariesGlobalService
      .validateAddInternationalBeneficiary(params)
      .subscribe((result) => {
        if (result.errorCode === '0') {
          this.generateChallengeAndOTP = result['generateChallengeAndOTP']
          this.sharedData['beneficiary'] = result['beneficiary']
          this.sharedData['generateChallengeAndOTP'] =
            this.generateChallengeAndOTP
          this.sharedData['aproveFlow'] = true
          this.sharedData['requestValidate'] = {}
          this.sharedData['params'] = params
          //this.sharedData['formGroup'] = this.form;
          this.formDataService.setSharedData(this.sharedData)
          sessionStorage.setItem('sharedData', JSON.stringify(this.sharedData))
          sessionStorage.setItem('formData', JSON.stringify(this.formData))

          this.router.navigate([
            '/beneficiaries/InternationalBeneficiary/AddStep3',
          ])
        } else {
          this.isError = true
        }
      })
  }

  onChangeCategory(event) {
    this.clearAllFields()
    if (this.isCountrySelection) {
      this.form.controls['country'].enable()
    } else {
      this.form.controls['country'].disable()
    }
  }

  // Filtrado de bancos en función del pais seleccionado

  onRemoveCountry() {
    this.formData.country = ''
    this.form = this.fb.group({
      bankName: [''],
      country: [''],
      branchName: [''],
      currency: [''],
      category: [''],
      transferType: [''],
    })
  }

  onChangeCountry($event) {
    this.form.controls['bankName'].enable()
    this.form.controls['bankName'].reset()
    this.form.controls['branchName'].reset()
    this.form.controls['currency'].reset()
    this.formData.swiftCode = ''
    if ($event === undefined) {
      this.form.controls['bankName'].disable()
      for (const item of this.mandatoryFields) {
        this.form.removeControl(item.name)
      }
      this.formData.bankNames = []
      this.formData.branchsNames = []
      this.formData.currencyList = []
      this.formData.transferTypes = []
      this.mandatoryFields = []
      this.selectedCountry = null
      this.formData.selectedCountry = this.selectedCountry
      this.isIndia = false
      return
    }
    if ($event.value == 'India') {
      this.isIndia = true
      this.formData.isIndia = this.isIndia
    } else {
      this.isIndia = false
      this.formData.isIndia = this.isIndia
    }
    this.selectedCountry = $event
    this.formData.selectedCountry = this.selectedCountry
    const newbankNames = []
    if ($event.ISO != '' && $event.key != '') {
      this.addInternationalBeneficiaryService
        .getBanks('PAY', $event.key, $event.ISO)
        .subscribe((bankList) => {
          for (const bank of bankList.banks) {
            if (bank.swiftCode) {
              newbankNames.push(bank)
            }
          }
          this.formData.bankNames = newbankNames
        })
    }
  }

  onChangeDropDown(event, fieldName: string): void {
    if (event == undefined) {
      return
    }
    // this.form.controls[fieldName].patchValue(event.value)
    // this.form.controls[fieldName].value(event.key)
  }

  onChangeBankName($event) {
    this.form.controls['currency'].enable()
    this.form.controls['branchName'].enable()
    this.form.controls['branchName'].reset()
    this.form.controls['currency'].reset()
    this.form.controls['transferType'].reset()
    this.formData.swiftCode = ''
    for (const item of this.mandatoryFields) {
      this.form.removeControl(item.name)
    }
    this.mandatoryFields = []
    this.formData.currencyList = []
    this.formData.transferTypes = []
    this.mandatoryFields = []
    this.selectedBank = null
    this.formData.selectedBank = this.selectedBank
    if ($event === undefined) {
      this.form.controls['currency'].disable()
      this.form.controls['branchName'].disable()
      for (const item of this.mandatoryFields) {
        this.form.removeControl(item.name)
      }
      this.mandatoryFields = []
      this.formData.currencyList = []
      this.formData.transferTypes = []
      this.mandatoryFields = []
      this.selectedBank = null
      this.formData.selectedBank = this.selectedBank

      return
    }
    this.selectedBank = $event
    this.formData.selectedBank = this.selectedBank
    this.formData.bankName = $event
    this.formData.swiftCode = this.selectedBank.swiftCode
    const bank: any = this.formData.bankName
    this.addInternationalBeneficiaryService
      .getBranches(bank, this.selectedCountry.key)
      .subscribe((branchList) => {
        this.formData.branchsNames = branchList.bankBranchList
        if (this.formData.branchsNames.length == 1) {
          this.form.controls['branchName'].patchValue(
            this.formData.branchsNames[0].beneficiaryBankBranch,
          )
          this.selectedBranch = this.formData.branchsNames[0]
          this.onChangeBranch(this.selectedBranch)
          this.addInternationalBeneficiaryService
            .getInternationalCurrencies(
              'PAY',
              this.selectedCountry.key,
              bank.bankCode,
            )
            .subscribe((currencyList) => {
              this.formData.currencyList = currencyList.currencies
              if (this.formData.currencyList.length == 1) {
                this.form.controls['currency'].patchValue(
                  this.formData.currencyList[0].currencyName,
                )
                this.selectedCurrency = this.formData.currencyList[0]
                this.onChangeCurrency(this.selectedCurrency)
              }
            })
        } else if (this.formData.branchsNames.length > 1) {
          this.addInternationalBeneficiaryService
            .getInternationalCurrencies(
              'PAY',
              this.selectedCountry.key,
              bank.bankCode,
            )
            .subscribe((currencyList) => {
              this.formData.currencyList = currencyList.currencies
              if (this.formData.currencyList.length == 1) {
                this.form.controls['currency'].patchValue(
                  this.formData.currencyList[0].currencyName,
                )
                this.selectedCurrency = this.formData.currencyList[0]
                this.onChangeCurrency(this.selectedCurrency)
              }
            })
        }
      })
  }

  onRemoveBankName() {
    this.formData.bankName = ''
    this.formData.bankAddress = ''
    this.formData.branchName = ''
    this.formData.branchAddress = ''
    this.formData.branchsNames = []
  }

  onChangeCurrency($event): void {
    for (const item of this.mandatoryFields) {
      this.form.removeControl(item.name)
    }
    this.mandatoryFields = []
    if ($event === undefined) {
      this.selectedCurrency = null
      for (const item of this.mandatoryFields) {
        this.form.removeControl(item.name)
      }
      this.mandatoryFields = []
      this.formData.selectedCurrency = this.selectedCurrency
      return
    }
    this.selectedCurrency = $event
    this.formData.selectedCurrency = this.selectedCurrency
    this.formData.currency = $event
    this.formData.currencyCode = this.formData.currency
      ? this.formData.currency.currencyCode
      : ''
    this.form.controls['currency'].enable()
    this.getBankCongigurations()
  }

  validateAccount(c: FormControl) {
    let result = {
      validateAccount: {
        valid: false,
      },
    }
    if (this.formData.accountFormats) {
      for (const format of this.formData.accountFormats) {
        if (format) {
          if (c.value.length === format.length) {
            let i = 0
            for (i; i < c.value.length; i++) {
              const data = format[i]
              const actual = c.value[i]
              if (
                (data === 'A' && !this.isAlphabet(actual)) ||
                (data === 'N' && this.isAlphabet(actual))
              ) {
                break
              }
            }
            if (i == c.value.length) {
              result = null
              break
            }
          }
        }
      }
    } else {
      result = null
    }
    return result
  }

  onChangeBranch($event) {
    if ($event === undefined) {
      this.selectedBranch = null
      this.formData.selectedBranch = this.selectedBranch
      for (const item of this.mandatoryFields) {
        this.form.removeControl(item.name)
      }

      this.formData.currencyList = []
      this.formData.transferTypes = []
      this.mandatoryFields = []
      return
    }

    this.selectedBranch = $event
    this.formData.selectedBranch = this.selectedBranch
    this.formData.branchName = $event.beneficiaryBankBranch
  }

  onChangeSwiftCode(event) {
    if (
      event.target.value == null ||
      event.target.value == '' ||
      event.target.value == undefined
    ) {
      return
    }
    if (this.lastSelectedSwift === event.target.value) {
      return
    }
    for (const item of this.mandatoryFields) {
      this.form.removeControl(item.name)
    }
    this.mandatoryFields = []
    this.addInternationalBeneficiaryService
      .getBankDetails(event.target.value)
      .subscribe((details) => {
        this.lastSelectedSwift = event.target.value
        console.dir(details)
        this.selectedCountry = {}
        if (details.country) {
          this.selectedCountry.key = details.country.countryCode
          this.selectedCountry.ISO = details.country.countryISO
          this.selectedCountry.value = details.country.countryDesc
          this.form.controls['country'].patchValue(details.country.countryDesc)
          this.form.controls['country'].disable()
          this.formData.selectedCountry = this.selectedCountry
          let routingIndex = 'B'
          if (this.selectedCountry && this.selectedCountry.value == 'India') {
            if (
              this.formData.swiftCode.charAt(4) != 'I' &&
              this.formData.swiftCode.charAt(5) != 'N'
            ) {
              routingIndex = 'R'
            }
          }
        }
        this.selectedBank = {}
        if (details.routingIndex) {
          this.selectedBank.routingIndex = details.routingIndex
        }
        if (details.routingCode) {
          this.selectedBank.swiftCode = details.routingCode
        }
        if (details.bankBranchList && details.bankBranchList.length > 0) {
          this.selectedBank.bankCode =
            details.bankBranchList[0].beneficiaryBankABI
          this.selectedBank.bankName =
            details.bankBranchList[0].beneficiaryBankName
          this.form.controls['branchName'].patchValue(
            details.bankBranchList[0].beneficiaryBankBranch,
          )
        }

        this.formData.selectedBank = this.selectedBank
        this.selectedBranch = details.bankBranchList[0]
        this.formData.selectedBranch = this.selectedBranch
        this.selectedCurrency = details.bankCurrencies[0]
        this.formData.selectedCurrency = this.selectedCurrency
        this.formData.branchsNames = details.bankBranchList
        this.formData.currencyList = details.bankCurrencies
        this.form.controls['bankName'].disable()
        this.form.controls['branchName'].disable()

        this.form.controls['bankName'].patchValue(this.selectedBank.bankName)

        if (
          details.bankCurrencies.length != 0 &&
          details.bankCurrencies.length == 1
        ) {
          this.form.controls['currency'].patchValue(
            details.bankCurrencies[0].currencyName,
          )

          this.onChangeCurrency(this.selectedCurrency)
        } else {
          this.form.controls['currency'].enable()
          this.formData.currencyList = details.bankCurrencies
        }
      })
  }

  onDeleteBranch() {
    this.formData.branchName = ''
    this.formData.branchNameTransform = ''
    this.formData.branchCodeTransform = ''
    this.formData.swiftCode = ''
    this.formData.bankAddress = ''
    this.formData.branchAddress = ''
    this.isBankAddressDisabled = true
    this.isBranchAddressDisabled = true
  }

  goBack() {
    this.router.navigate(['/beneficiaries/AddBeneficiaries'])
  }

  refreshData() {
    this.addInternationalBeneficiaryService
      .getCountryNames('PAY')
      .subscribe((countriesList) => {
        this.countryData = countriesList
        const countrysGroup = []
        this.countryData.countries.forEach((element) => {
          countrysGroup.push({
            key: element.countryCode,
            value: element.countryDesc,
            ISO: element.countryISO,
          })
        })

        countrysGroup.sort((a, b) =>
          a.value > b.value ? 1 : b.value > a.value ? -1 : 0,
        )

        this.formData.countriesName = countrysGroup
      })
  }

  ngOnDestroy() {
    this.formDataService.setData(this.formData)
    this.formDataService.setSharedData(this.sharedData)
  }

  isValid(): boolean {
    return this.form.valid
  }

  validateIbanFormat(control: FormControl) {
    const format = this.formData.ibanFormat
    if (control.value.length !== format.length / 2) {
      return {
        validateIBAN: {
          valid: false,
        },
      }
    }
    for (let i = 0, j = 0; i < control.value.length; i++, j += 2) {
      const meta = format[j]
      const data = format[j + 1]
      const actual = control.value[i]
      if (meta === 'F' && data !== actual) {
        return {
          validateIBAN: {
            valid: false,
          },
        }
      }
      if (meta === 'V') {
        if (data === 'A' && !this.isAlphabet(actual)) {
          return {
            validateIBAN: {
              valid: false,
            },
          }
        }
        if (data === 'N' && this.isAlphabet(actual)) {
          return {
            validateIBAN: {
              valid: false,
            },
          }
        }
      }
    }
    return null
  }

  isAlphabet(c) {
    return c.toLowerCase() !== c.toUpperCase()
  }

  getBankCongigurations() {
    this.addInternationalBeneficiaryService
      .getBankConfigurations(
        this.selectedBank,
        this.selectedCountry,
        this.selectedCurrency,
        this.formData.category,
        null,
      )
      .subscribe((bankConfigurations) => {
        if (bankConfigurations && bankConfigurations.transferType) {
          this.selectedTransferType = {}
          this.selectedTransferType = bankConfigurations.transferType
        }
        for (const field of bankConfigurations.mandatoryFields) {
          if (!field.name) {
            continue
          }
          if (
            bankConfigurations.accountRules.length != 0 &&
            bankConfigurations.accountRules[0].ibanMandatory == true
          ) {
            if (field.name === 'BeneficiaryBankAcct') {
              continue
            }
          } else {
            if (field.name === 'BeneficiaryIBAN') {
              continue
            }
          }
          if (!field.type && !field.label) {
            continue
          }
          const validation = {
            min: 0,
            max: 0,
            pattren: '',
          }
          if (field.validation) {
            const validations = field.validation.split('|')
            for (const item of validations) {
              if (item === null || item === undefined) {
                continue
              }
              if (item.includes('min')) {
                let min = item.match(/\d/g)
                min = min.join('')
                validation.min = min
              }
              if (item.includes('max')) {
                let max = item.match(/\d/g)
                max = max.join('')
                validation.max = max
              }
            }
            if (
              field.validation.includes('onlyAlphabetic') &&
              field.validation.includes('noEngLetters')
            ) {
              validation.pattren = '^[\u0600-\u06FF ]*'
            } else if (field.validation.includes('onlyAlphabetic')) {
              validation.pattren = '^[a-zA-Z\u0600-\u06FF ]*'
            } else if (field.validation.includes('noSpecialChar')) {
              validation.pattren = '^[a-zA-Z0-9\u0600-\u06FF ]*'
            } else if (
              field.validation.includes('onlyNumbers') ||
              field.type === 'numeric'
            ) {
              validation.pattren = '[0-9]+'
            } else if (
              field.validation.includes('onlyAlphabetic') &&
              field.validation.includes('noArabic')
            ) {
              validation.pattren = '^[a-zA-Z ]*'
            }
          }
          const property = field.name
          if (field.type === 'mixed' && field.validation !== null) {
            this.form.addControl(
              property,
              new FormControl('', Validators.required),
            )
          } else if (field.type === 'mixed') {
            this.form.addControl(
              property,
              new FormControl('', Validators.required),
            )
          } else if (field.type === 'date') {
            this.form.addControl(
              property,
              new FormControl('', Validators.required),
            )
          } else if (field.name === 'BeneficiaryIBAN') {
            this.formData.ibanFormat =
              bankConfigurations.accountRules[0].ibanFormat
            this.form.addControl(
              property,
              new FormControl('', [
                Validators.required,
                this.validateIbanFormat.bind(this),
              ]),
            )
          } else if (field.name === 'BeneficiaryBankAcct') {
            if (
              bankConfigurations.accountRules.length == 0 ||
              bankConfigurations.accountRules[0].acceptedAccountFrmats == null
            ) {
              this.form.addControl(
                property,
                new FormControl('', Validators.compose([Validators.required])),
              )
            } else {
              if (
                bankConfigurations.accountRules.length != 0 &&
                bankConfigurations.accountRules[0].acceptedAccountFrmats != null
              ) {
                this.formData.accountFormats =
                  bankConfigurations.accountRules[0].acceptedAccountFrmats
                this.form.addControl(
                  property,
                  new FormControl('', [
                    Validators.required,
                    this.validateAccount.bind(this),
                  ]),
                )
              }
            }
          } else {
            if (validation.max == 0) {
              this.form.addControl(
                property,
                new FormControl(
                  '',
                  Validators.compose([
                    Validators.required,
                    Validators.minLength(validation.min),
                    Validators.pattern(validation.pattren),
                  ]),
                ),
              )
            } else {
              this.form.addControl(
                property,
                new FormControl(
                  '',
                  Validators.compose([
                    Validators.required,
                    Validators.minLength(validation.min),
                    Validators.maxLength(validation.max),
                    Validators.pattern(validation.pattren),
                  ]),
                ),
              )
            }
          }
          this.mandatoryFields.push(field)
        }
        this.isValid()
      })
  }

  onChangeSelectionType() {
    this.clearAllFields()
    this.isValid()
    this.isSelectionDone = true
    if (this.formData.selectionCriteria == 'countrySelection') {
      this.form.controls['country'].enable()
      this.isCountrySelection = true
    } else if (this.formData.selectionCriteria == 'swiftSelection') {
      this.form.controls['country'].disable()
      this.form.controls['bankName'].disable()
      this.form.controls['currency'].disable()
      this.form.controls['branchName'].disable()
      this.isCountrySelection = false
    }
  }

  clearAllFields() {
    for (const item of this.mandatoryFields) {
      this.form.removeControl(item.name)
    }
    this.form.controls['country'].patchValue('')
    this.form.controls['bankName'].patchValue('')
    this.form.controls['branchName'].patchValue('')
    this.form.controls['currency'].patchValue('')
    this.formData.swiftCode = ''
    if (!this.isCountrySelection) {
      this.form.controls['country'].disable()
    }
    this.form.controls['bankName'].disable()
    this.form.controls['currency'].disable()
    this.form.controls['branchName'].disable()
    this.formData.bankNames = []
    this.formData.branchsNames = []
    this.formData.currencyList = []
    this.formData.transferTypes = []
    this.mandatoryFields = []
    this.selectedCountry = null
    this.formData.selectedCountry = this.selectedCountry
    this.isIndia = false
    return
  }
  getMaxDateToday(date) {
    return date ? date : this.today
  }
}
