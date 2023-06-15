import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StorageService } from '../../../../../../core/storage/storage.service'
import { SadadOlpCaEnrollmentService } from '../sadad-olp-ca-enrollment.service'

@Component({
  selector: 'app-sadad-olp-ca-enrollment-form',
  templateUrl: './sadad-olp-ca-enrollment-form.component.html',
})
export class SadadOlpCaEnrollmentFormComponent implements OnInit, OnDestroy {
  comboData: any = []
  dateFrom = new Date()
  dateTo = new Date()
  today = new Date()
  enableChangeServiceStatusButton = false

  bsConfig: any
  @Input() form: FormGroup
  @Input() title: string
  @Input() readonly: boolean

  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public storageService: StorageService,
    public router: Router,
    public service: SadadOlpCaEnrollmentService,
  ) {}

  get caEnrollmentForm(): FormGroup {
    return this.form as FormGroup
  }

  get caEnrollmentData(): any {
    if (this.service.data != null) {
      return this.service.data.sadadOlpMerchantDetails
    }
    return null
  }

  get accountOptions(): any {
    if (this.service.data != null) {
      return this.service.data.accountList
    }
  }

  getComboOptions(comboName) {
    return this.comboData[comboName]
  }

  getCurrency() {
    const currency_list = this.getComboOptions('currency')
    if (
      this.caEnrollmentData &&
      this.caEnrollmentData.currency &&
      currency_list
    ) {
      const currencyObj = currency_list.find((element) => {
        return element.key == this.caEnrollmentData.currency
      })
      if (currencyObj) {
        return currencyObj.value
      }
    }
  }

  ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )

    this.subscriptions.push(
      this.form
        .get('dateFrom')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          this.dateFrom = value ? value : this.today
        }),
    )
    this.subscriptions.push(
      this.form
        .get('dateTo')
        .valueChanges.pipe(distinctUntilChanged())
        .subscribe((value) => {
          this.dateTo = value
        }),
    )

    this.subscriptions.push(
      this.service
        .getComboData()
        .pipe(distinctUntilChanged())
        .subscribe((result) => {
          this.comboData = result
        }),
    )

    this.subscriptions.push(
      this.caEnrollmentForm.valueChanges
        .pipe(distinctUntilChanged())
        .subscribe((result) => {
          //
          const dateF = result['dateFrom']
          const dateT = result['dateTo']

          if (dateF == '' || dateT == '') {
            this.enableChangeServiceStatusButton = true
          } else {
            this.enableChangeServiceStatusButton = false
          }
        }),
    )
  }

  getMaxDateToday(date) {
    return date ? date : this.today
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  serviceOLPStatusDisable() {
    return (
      this.caEnrollmentData &&
      this.caEnrollmentData.merchantStatus ==
        this.service.MERCHANT_STATUS_DISABLED
    )
  }

  serviceOLPStatusActive() {
    return (
      this.caEnrollmentData &&
      this.caEnrollmentData.merchantStatus ==
        this.service.MERCHANT_STATUS_ACTIVE
    )
  }

  updateService(action) {
    this.service.operation = action
  }

  cancel() {
    this.service.operation = ''
  }

  dateSelected() {
    return this.enableChangeServiceStatusButton
  }

  serviceOLPOperationSelected() {
    return this.service.operation != ''
  }

  confirmOperation() {
    let response: any
    this.service
      .confirmChangeSerivceOLPStatus(
        this.dateFrom,
        this.dateTo,
        this.service.operation,
      )
      .subscribe((result) => {
        if (result['errorCode'] !== '0') {
        } else {
          response = result
          this.service.refresh.next(true)
        }
      })
  }

  get company() {
    const currentUser = JSON.parse(this.storageService.retrieve('currentUser'))
    const company = currentUser.company
    return company
  }
}
