import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core'
import {FormGroup, Validators} from '@angular/forms'
import {PrePaidCardRequestService} from './pre-paid-card-request.service'
import {StaticService} from '../../Common/Services/static.service'
import {Subject} from 'rxjs'
import {takeUntil} from 'rxjs/operators'
import {CommonValidators} from '../../Common/constants/common-validators.service'
import {TranslateService} from '@ngx-translate/core'
import {SimpleMQ} from 'ng2-simple-mq'
import {UserJourney} from "./PrepaidCardRequestModel";
import {Account} from "../../../Model/account";

@Component({
  selector: 'app-pre-paid-card-request-step1',
  templateUrl: './pre-paid-card-request-step1.component.html',
  styleUrls: ['./pre-paid-card-request.component.scss'],
})
export class PrePaidCardRequestStep1Component implements OnInit, OnDestroy {

  @Input() form: FormGroup
  @Output() formChange: EventEmitter<FormGroup> = new EventEmitter<FormGroup>()

  @Input() canProceedStep1: boolean
  @Output() canProceedStep1Change: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() selectedUserJourney: UserJourney
  @Output() selectedUserJourneyChange: EventEmitter<UserJourney> = new EventEmitter<UserJourney>();

  @Output() onCompanyCRChange: EventEmitter<any> = new EventEmitter<any>();

  @Input() ownerData
  @Output() ownerDataChange: EventEmitter<any> = new EventEmitter<any>();


  @Input() selectedFullAccountNumber: string
  @Output() selectedFullAccountNumberChange = new EventEmitter<string>()

  UserJourney = UserJourney // To expose the enum to HTML

  public today: Date = new Date()
  public nationalities
  public cities
  valueLists = ['nationalityCode', 'cityType']

  userJourniesRadio = [
    {value: 'owner',
    text: 'Apply for owner',
    checked: false},
    {value: 'employee',
      text: 'Apply for employee',
      checked: true}
  ]

  bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
  )

  public gender = [
    {
      key: 'F',
      value: 'Female',
    },
    {
      key: 'M',
      value: 'Male',
    },
  ]


  private readonly onDestroy$ = new Subject<any>()
  public accounts
  constructor(
      public service: PrePaidCardRequestService,
      public staticService: StaticService,
      public commonValidators: CommonValidators,
      public translate: TranslateService,
      private smq: SimpleMQ,
  ) {
  }

    ngOnInit(): void {
      this.canProceedStep1 = true
      this.canProceedStep1Change.emit(this.canProceedStep1)
        this.service.getSarAccounts()
            .pipe(takeUntil(this.onDestroy$))
            .subscribe((res) => {
                this.accounts = res
            })
        if (!this.selectedUserJourney) {
            this.selectedUserJourney = UserJourney.EMPLOYEE
        }
        this.selectedUserJourneyChange.emit(this.selectedUserJourney)
    }


  ngOnDestroy() {
    this.onDestroy$.next()
  }

  switchForm(event){
    const account = {fullAccountNumber: this.form?.controls['account'].value}
    this.form = this.service.switchForm(this.selectedUserJourney)

    switch (this.selectedUserJourney) {
      case UserJourney.OWNER:
        this.canProceedStep1 = false
        this.canProceedStep1Change.emit(this.canProceedStep1)
        this.selectedUserJourneyChange.emit(this.selectedUserJourney)

        this.service.getOwnerData().subscribe(res => {
          this.ownerData = res
          this.ownerDataChange.emit(this.ownerData)

          this.form.controls['companyEmbossingName'].patchValue(res.companyEmbossingName)
          this.form.controls['companyEmbossingName'].setValidators(res.companyEmbossingName ? [] : [Validators.required, Validators.pattern(this.commonValidators.ONLY_ENGLISH_WITH_SPACE)])
          this.form.controls['companyEmbossingName'].updateValueAndValidity()

          this.form.controls['holderFirstName'].patchValue(res.firstName)
          this.form.controls['holderFirstName'].setValidators(res.firstName ? [] : [Validators.required, Validators.pattern(this.commonValidators.nameValidatorPattern)])
          this.form.controls['holderFirstName'].updateValueAndValidity()

          this.form.controls['holderLastName'].patchValue(res.lastName)
          this.form.controls['holderLastName'].setValidators(res.lastName ? [] : [Validators.required, Validators.pattern(this.commonValidators.nameValidatorPattern)])
          this.form.controls['holderLastName'].updateValueAndValidity()

          this.form.controls['companyCR'].patchValue(res.companyEmbossingName)
          this.form.controls['companyCR'].setValidators(res.companyEmbossingName ? [] : [Validators.required])
          this.form.controls['companyCR'].updateValueAndValidity()

          this.form.controls['gender'].patchValue(res.gender)
          this.form.controls['gender'].setValidators(res.gender ? [] : [Validators.required])
          this.form.controls['gender'].updateValueAndValidity()

          this.form.controls['dataOfBirth'].patchValue(res.birthDate)
          this.form.controls['dataOfBirth'].setValidators(res.birthDate ? [] : [Validators.required])
          this.form.controls['dataOfBirth'].updateValueAndValidity()

          this.form.controls['national_id'].patchValue(res.nationalId)
          this.form.controls['national_id'].setValidators(res.nationalId ? [] : [Validators.required, this.commonValidators.getValidatorForSAID, Validators.pattern('^[0-9]*$')])
          this.form.controls['national_id'].updateValueAndValidity()

          this.form.controls['memberPhoneNumber'].patchValue(res.mobileNumber)
          this.form.controls['memberPhoneNumber'].setValidators(res.mobileNumber ? [] : [Validators.required, Validators.pattern(this.commonValidators.mobileNumberValidatorPattern)])
          this.form.controls['memberPhoneNumber'].updateValueAndValidity()

          this.form.controls['nationality'].patchValue(res.nationality)
          this.form.controls['nationality'].setValidators(res.nationality ? [] : [Validators.required])
          this.form.controls['nationality'].updateValueAndValidity()

          this.form.controls['city'].patchValue(res.city)
          this.form.controls['city'].setValidators(res.city ? [] : [Validators.required])
          this.form.controls['city'].updateValueAndValidity()

          if(this.ownerData?.ownerEmbossingName?.length > 0){
            this.form.controls['ownerEmbossingName'].setValidators([Validators.required])
            this.form.controls['ownerEmbossingName'].updateValueAndValidity()
          }
        })

        this.setStaticData()
        break
      case UserJourney.EMPLOYEE:
        this.canProceedStep1 = true
        this.canProceedStep1Change.emit(this.canProceedStep1)
        this.selectedUserJourneyChange.emit(this.selectedUserJourney)
        break
    }

    this.selectAccount(account)
    this.formChange.emit(this.form)
  }

  selectAccount(event){
    if(event){
      this.selectedFullAccountNumber = event.fullAccountNumber
      this.selectedFullAccountNumberChange.emit(this.selectedFullAccountNumber)
      this.form.controls['account'].patchValue(event.fullAccountNumber)
    }
  }

  companyRegistrationChange(event) {
    const fileList: FileList = event.target.files
    if (fileList.length > 0) {
      if (this.isAllowedType(fileList[0].name)) {
        if (fileList[0].size < 5242880) {
          this.form.controls['companyCR'].setValue(fileList[0].name)
          this.onCompanyCRChange.emit(fileList[0])
        } else {
          event.target.value = null
          this.form.controls['companyCR'].setValue(null)
          this.smq.publish('error-mq', this.translate.instant('error.maxFileSizeExceeded'))
        }
      } else {
        event.target.value = null
        this.form.controls['companyCR'].setValue(null)
        this.smq.publish('error-mq', this.translate.instant('error.typeError'))
      }
    }
  }

  isAllowedType(name: string) {
    const type = name.split('.').pop().toLowerCase()
    return type == 'pdf' || type == 'jpeg' || type == 'jpg' || type == 'gif' || type == 'png'
  }

  setStaticData(){
    this.staticService.getAllCombos(this.valueLists)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe((res) => {
          const nationalities = this.staticService.getCompoByName(
              'nationalityCode',
              res,
          ).values
          const cities = this.staticService.getCompoByName('cityType', res).values

          this.cities = []
          Object.keys(cities).map((key, index) => {
            this.cities.push({ key: key, value: cities[key] })
          })
          this.nationalities = []
          Object.keys(nationalities).map((key, index) => {
            this.nationalities.push({ key: key, value: nationalities[key] })
          })
        })
  }

  markOwnerEmbossingAsTouched(){
    this.form.controls['ownerEmbossingName'].markAsTouched()
  }
}