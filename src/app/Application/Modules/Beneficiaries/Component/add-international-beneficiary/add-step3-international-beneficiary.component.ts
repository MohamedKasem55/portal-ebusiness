import { Location } from '@angular/common'
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'

// Import required to work with a shared data model.
import { Subscription } from 'rxjs'
import { FormDataService } from '../../Services/shared-form-data.service'

// General service to optain static data
import { BeneficiariesFormData } from '../../Services/beneficiaries-form-data.service'

// General service to add beneficiaries
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { BeneficiariesGlobalService } from '../../Services/beneficiaries-global.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { SessionStorage } from 'ngx-webstorage'

@Component({
  templateUrl:
    '../../View/add-international-beneficiary/add-step3-international-beneficiary.html',
})
export class AddStep3InternationalBeneficiary implements OnInit, OnDestroy {
  @ViewChild('authorization', {
    static: true,
  })
  authorization: any
  @Input() formData: any

  copyFormData: any
  model: any
  countries: string[] = []
  banks: string[] = []
  currencies: string[] = []
  nationalities: string[] = []
  value: Date
  public category: any
  public IndividualFields = true
  subscription: Subscription
  sharedData: any
  form: FormGroup

  dateFormat = 'yyyy-MM-dd'

  constructor(
    public formDataService: FormDataService,
    public comboDataBeneficiaries: BeneficiariesFormData,
    public beneficiariesGlobalService: BeneficiariesGlobalService,
    public _location: Location,
    public router: Router,
    private dateFormatPipe: DateFormatPipe,
    private fb: FormBuilder,
  ) {
    this.model = {
      account: '',
    }
  }

  saveInternationalBeneficiary(): void {
    const orgformData = JSON.parse(JSON.stringify(this.formData))

    // ----------- PARAMETROS DE SALIDA ------------- //
    const params = this.sharedData.params
    params.requestValidate = this.sharedData.requestValidate

    // Llamada al servio post con los datos del formulario en un json
    // Se espera a la respuesta y se muestra la modal de OK el envío.
    this.subscription = this.beneficiariesGlobalService
      .addInternationalBeneficiary(params)
      .subscribe((result) => {
        if (result.errorCode === '0') {
          //console.log("TODO OK");
          this.router.navigate(['/beneficiaries/AddBeneficiariesLastStep'])
        } else {
          this.formData = orgformData
        }

        this.subscription.unsubscribe()
      })
  }

  getCountryText(contryKey) {
    for (let i = 0; i < this.formData.countriesName.length; i++) {
      if (this.formData.countriesName[i].key == contryKey) {
        return this.formData.countriesName[i].value
      }
    }
  }

  saveInternationalCompanyBeneficiary(): void {
    this.router.navigate(['/beneficiaries/AddBeneficiariesLastStep'])
  }

  goBack() {
    this.router.navigate(['/beneficiaries/InternationalBeneficiary/AddStep2'])
  }

  getDateString(date: Date): string {
    return (
      date.getDate()! + '/' + (date.getMonth() + 1)! + '/' + date.getFullYear()!
    )
  }

  ngOnInit() {
    this.form = this.fb.group({
      userId: ['', Validators.required],
    })
    // Obtención de los datos del modelo del componente anterior para el wizard
    if (
      this.formDataService.getSharedData() == null ||
      this.formDataService.getSharedData() == undefined
    ) {
      this.sharedData = JSON.parse(sessionStorage.getItem('sharedData'))
      this.formData = JSON.parse(sessionStorage.getItem('formData'))
    } else {
      this.formData = this.formDataService.getData()
      this.sharedData = this.formDataService.getSharedData()
    }

    // this.form = this.sharedData.formGroup;

    this.formData.tmpCountry = []
    this.formData.tmpCurrency = []
    this.formData.tmpCountryDocID = []

    // Load the category selected on step 2
    this.category = this.formData.category
    if (this.category === 'Individual') {
      this.IndividualFields = true
    } else {
      this.IndividualFields = false
    }
  }

  ngOnDestroy() {
    this.formDataService.setData(this.formData)
    this.formDataService.setSharedData(this.sharedData)
  }

  valid() {
    return (
      !this.sharedData.generateChallengeAndOTP ||
      !this.authorization ||
      this.authorization.valid()
    )
  }
  finish() {
    this.formData.errorAccountValidation = false
    this.router.navigateByUrl('/beneficiaries/AddBeneficiariesLastStep')
    sessionStorage.removeItem('sharedData')
    sessionStorage.removeItem('formData')
  }
}
