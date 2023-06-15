import { AbstractWizardComponent } from '../../../Common/Components/Abstract/abstract-wizard.component'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { SadadOlpCaEnrollmentService } from './sadad-olp-ca-enrollment.service'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { StaticService } from '../../../Common/Services/static.service'
import { distinctUntilChanged } from 'rxjs/operators'

@Component({
  templateUrl: './sadad-olp-ca-enrollment.component.html',
})
export class SadadOlpCaEnrollmentComponent
  extends AbstractWizardComponent
  implements OnInit, OnDestroy
{
  formCAEnrollment: FormGroup
  caEnrollmentData: any
  comboData: any
  wizardStepsCount = 3

  constructor(
    public fb: FormBuilder,
    public service: SadadOlpCaEnrollmentService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
  ) {
    super(fb, translate, router)
    //first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    this.formCAEnrollment = fb.group({
      accountNumber: ['', [Validators.required]],
      dateFrom: [''],
      dateTo: [''],
      companyNameAR: [''],
      companyNameEN: ['', [Validators.required]],
      sicCode: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      middleName: [''],
      lastName: ['', [Validators.required]],
      telephoneNumber: ['', [Validators.required, Validators.maxLength(15)]], //TODO ask for a phone number pattern
      // telephoneNumber: ['',[Validators.required,Validators.maxLength(15), Validators.pattern("(\\+9665|05)[0-9]{8,8}$")]],
      emailAddress: [
        '',
        [
          Validators.required,
          Validators.email,
          this.mailFormat,
          Validators.maxLength(40),
        ],
      ],
      firstName2: [''],
      middleName2: [''],
      lastName2: [''],
      telephoneNumber2: ['', [Validators.required, Validators.maxLength(15)]], //TODO ask for a phone number pattern
      // telephoneNumber2: ['',[Validators.required,Validators.maxLength(15), Validators.pattern("(\\+9665|05)[0-9]{8,8}$")]],
      emailAddress2: [
        '',
        [
          Validators.required,
          Validators.email,
          this.mailFormat,
          Validators.maxLength(40),
        ],
      ],
      addressLine1: ['', [Validators.required]],
      addressLine2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]],
    })
  }

  ngOnInit() {
    super.ngOnInit()

    this.buildCombosData()
    this.loadServiceOlpDetails()
    this.subscriptions.push(
      this.service.refresh
        .asObservable()
        .pipe(distinctUntilChanged())
        .subscribe((result) => {
          if (result == true) {
            this.service.operation = ''
            this.clearForm()
            this.loadServiceOlpDetails()
            this.service.refresh.next(false)
          }
        }),
    )
    this.service.setComboData(this.comboData)
  }

  loadServiceOlpDetails() {
    this.subscriptions.push(
      this.service.detailsCAEnrollment().subscribe((response) => {
        if (response.hasOwnProperty('error')) {
          this.onError(response)
        } else {
          this.service.data = response
          this.caEnrollmentData = response
          this.setFormData(this.caEnrollmentData, this.formCAEnrollment)
          this.disabledControl(this.formCAEnrollment)
        }
      }),
    )
  }
  setFormData(data, form) {
    if (typeof data['sadadOlpMerchantDetails'] == 'undefined') {
      return
    }
    const caEnrollmentData = data['sadadOlpMerchantDetails']

    this.formCAEnrollment.controls['accountNumber'].patchValue(
      caEnrollmentData.companyOlpAccount.numberAccount,
    )
    this.formCAEnrollment.controls['companyNameAR'].patchValue(
      caEnrollmentData.companyNameAR,
    )
    this.formCAEnrollment.controls['companyNameEN'].patchValue(
      caEnrollmentData.companyNameEN,
    )
    this.formCAEnrollment.controls['sicCode'].patchValue(
      caEnrollmentData.sicCode,
    )
    this.formCAEnrollment.controls['firstName'].patchValue(
      caEnrollmentData.firstName,
    )
    this.formCAEnrollment.controls['middleName'].patchValue(
      caEnrollmentData.middleName,
    )
    this.formCAEnrollment.controls['lastName'].patchValue(
      caEnrollmentData.lastName,
    )
    this.formCAEnrollment.controls['telephoneNumber'].patchValue(
      caEnrollmentData.phoneNumber,
    )
    this.formCAEnrollment.controls['emailAddress'].patchValue(
      caEnrollmentData.emailAddress,
    )
    this.formCAEnrollment.controls['firstName2'].patchValue(
      caEnrollmentData.firstName2,
    )
    this.formCAEnrollment.controls['middleName2'].patchValue(
      caEnrollmentData.middleName2,
    )
    this.formCAEnrollment.controls['lastName2'].patchValue(
      caEnrollmentData.lastName2,
    )
    this.formCAEnrollment.controls['telephoneNumber2'].patchValue(
      caEnrollmentData.phoneNumber2,
    )
    this.formCAEnrollment.controls['emailAddress2'].patchValue(
      caEnrollmentData.emailAddress2,
    )
    this.formCAEnrollment.controls['addressLine1'].patchValue(
      caEnrollmentData.addressLine1,
    )
    this.formCAEnrollment.controls['addressLine2'].patchValue(
      caEnrollmentData.addressLine2,
    )
    this.formCAEnrollment.controls['city'].patchValue(caEnrollmentData.city)
    this.formCAEnrollment.controls['postalCode'].patchValue(
      caEnrollmentData.postalCode,
    )
    this.formCAEnrollment.controls['country'].patchValue(
      caEnrollmentData.country,
    )
  }

  disabledControl(form: FormGroup) {
    if (form != null) {
      Object.keys(form.controls).forEach((key) => {
        // form.get(key).disable();
      })
    }
  }
  onInitStep(step, events) {
    switch (step) {
      case 1:
        // this.step1 = events;
        break
      case 2:
        // this.step2 = events;
        break
      case 3:
        // this.step3 = events;
        break
    }
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }

  isDisabled() {
    return true
  }

  valid() {
    return true
  }

  isBackAllowed() {
    return false
  }

  isNextAllowed() {
    return this.wizardStep === 1
  }

  isConfirmAllowed() {
    return this.wizardStep === 2
  }

  back() {
    return this.router.navigate(['/sadadOLP/ca-enrollment'])
  }

  next() {}

  nextAction() {
    switch (this.wizardStep) {
      case 1:
        this.markNextWizardStep()
        break
      case 2:
        const df = new Date()
        this.service
          .confirmUpdateSerivceOlpData(this.formCAEnrollment.getRawValue())
          .subscribe((result) => {
            if (result['errorCode'] !== '0') {
              this.onError(result)
            } else {
              this.confirmResponse = result
              this.markNextWizardStep()
            }
          })
        break
      case 3:
        this.finish()
        break
    }
  }

  clearForm() {
    this.formCAEnrollment.reset()
  }

  previous() {
    this.loadServiceOlpDetails()
    this.markPreviousWizardStep()
  }

  finish() {
    super.finish()
    this.service.refresh.next(true)
    return this.router.navigate(['/sadadOLP/ca-enrollment'])
  }

  getWizardStepsCount() {
    return this.wizardStepsCount
  }

  getWizarStepTitle() {
    if (this.service.operation == this.service.serviceActiveOperation) {
      return 'sadadOLP.caEnrollment.activeOLPService'
    } else if (this.service.operation == this.service.serviceDisableOperation) {
      return 'sadadOLP.caEnrollment.disableOLPService'
    } else if (
      this.service.operation == this.service.serviceUpdateDataOperation
    ) {
      return 'sadadOLP.caEnrollment.updateOLPServiceData'
    }
    return 'sadadOLP.caEnrollment.confirm'
  }

  mailFormat(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    }
    const EMAIL_REGEXP =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { incorrectMailFormat: true }
    }
    return null
  }

  buildCombosData() {
    this.comboData = []
    const combosSolicitados = [
      'sadadOLPCountryCode',
      'sadadOLPSICCode',
      'currency',
      'olpRefundStatus',
    ]

    this.subscriptions.push(
      this.staticService
        .getAllCombosAsArrays(combosSolicitados)
        .subscribe((comboData) => {
          const country = comboData['sadadOLPCountryCode']
          const sicCode = comboData['sadadOLPSICCode']
          const currency = comboData['currency']
          this.comboData['countryName'] = country
          this.comboData['sicCode'] = sicCode
          this.comboData['currency'] = currency
          this.service.setComboData(this.comboData)
        }),
    )
  }
}
