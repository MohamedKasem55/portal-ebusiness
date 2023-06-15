import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { ColapsablePanelComponent } from 'arb-design'
import { Subject, Subscription } from 'rxjs'
import { distinctUntilChanged } from 'rxjs/operators'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { ModelService } from '../../../Components/common/model.service'
import {
  CompanyDetailsUpdate,
  OrganizationDetailsService,
  PersonalDetailsDTO,
} from './organization-details.service'

export enum ViewType {
  DETAIL = 'detail',
  WIZARD = 'wizard',
}
@Component({
  selector: 'app-organization-details',
  templateUrl: './organization-details.component.html',
})
export class OrganizationDetailsComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('readOnlyPanel', { static: true })
  readOnlyPanel: ColapsablePanelComponent

  contactInfoForm: FormGroup
  wizardStep = 1
  data: PersonalDetailsDTO
  //  viewType = ViewType;
  view: ViewType
  viewDetails = ViewType.DETAIL
  viewWizard = ViewType.WIZARD

  areaCodes: any[]
  subscriptions: Subscription[] = []
  private onDestroy$: Subject<void> = new Subject<void>()

  constructor(
    private organizationDetailsService: OrganizationDetailsService,
    private fb: FormBuilder,
    private translateService: TranslateService,
    private modelService: ModelService,
    public authenticationService: AuthenticationService,
  ) {
    this.data = new PersonalDetailsDTO()
    this.contactInfoForm = fb.group({
      email: ['', [this.mailFormat]],
      mobileNumber: ['', [Validators.pattern('(05)[0-9]{8,8}$')]],
      selectedProperty: '',
      fax: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(7),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      faxAreaCode: [''],
      faxExtension: [
        '',
        [Validators.maxLength(4), Validators.pattern('^[0-9]*$')],
      ],
      phoneNumber: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(7),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      phoneNumberAreaCode: [''],
      phoneNumberExtension: [
        '',
        [Validators.maxLength(4), Validators.pattern('^[0-9]*$')],
      ],
      workNumber: [
        '',
        [
          Validators.minLength(5),
          Validators.maxLength(7),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      workNumberAreaCode: [''],
      workNumberExtension: [
        '',
        [Validators.maxLength(4), Validators.pattern('^[0-9]*$')],
      ],
    })
  }

  ngAfterViewInit() {
    this.readOnlyPanel.isCollapsedContent = false
  }

  ngOnInit() {
    this.view = ViewType.DETAIL
    this.subscriptions.push(
      this.organizationDetailsService
        .getPersonalDetails()
        .subscribe((personalDetails: PersonalDetailsDTO) => {
          this.data = personalDetails
          this.initFormData()
        }),
    )

    this.subscriptions.push(
      this.modelService
        .getModelObserver(this.translateService.currentLang, 'phoneNumAreaCode')
        .subscribe((result) => {
          this.areaCodes = result
        }),
    )
  }

  initFormData() {
    this.contactInfoForm.reset()
    if (this.data.customerDetails && this.data.customerDetails.variableData) {
      this.contactInfoForm.controls.selectedProperty.patchValue(
        this.data.customerDetails.variableData.selected,
      )
      if (this.data.customerDetails.variableData.personalDetailsMail) {
        this.contactInfoForm.controls.email.patchValue(
          this.data.customerDetails.variableData.personalDetailsMail
            .emailAddress,
        )
      }
      if (this.data.customerDetails.variableData.personalDetailsMobile) {
        this.contactInfoForm.controls.mobileNumber.patchValue(
          this.data.customerDetails.variableData.personalDetailsMobile
            .unvalidatednumber,
        )
      }
      if (this.data.customerDetails.variableData.personalDetailsFax) {
        this.contactInfoForm.controls.fax.patchValue(
          this.data.customerDetails.variableData.personalDetailsFax.number,
        )
        this.contactInfoForm.controls.faxAreaCode.patchValue(
          this.data.customerDetails.variableData.personalDetailsFax
            .unvalidatedareaCode,
        )
        this.contactInfoForm.controls.faxExtension.patchValue(
          this.cleanValue(
            this.data.customerDetails.variableData.personalDetailsFax.extension,
          ),
        )
      }
      if (this.data.customerDetails.variableData.personalDetailsPhone) {
        this.contactInfoForm.controls.phoneNumber.patchValue(
          this.data.customerDetails.variableData.personalDetailsPhone.number,
        )
        this.contactInfoForm.controls.phoneNumberAreaCode.patchValue(
          this.data.customerDetails.variableData.personalDetailsPhone
            .unvalidatedareaCode,
        )
        this.contactInfoForm.controls.phoneNumberExtension.patchValue(
          this.cleanValue(
            this.data.customerDetails.variableData.personalDetailsPhone
              .extension,
          ),
        )
      }
      if (this.data.customerDetails.variableData.personalDetailsWPhone) {
        this.contactInfoForm.controls.workNumber.patchValue(
          this.data.customerDetails.variableData.personalDetailsWPhone.number,
        )
        this.contactInfoForm.controls.workNumberAreaCode.patchValue(
          this.data.customerDetails.variableData.personalDetailsWPhone
            .unvalidatedareaCode,
        )
        this.contactInfoForm.controls.workNumberExtension.patchValue(
          this.cleanValue(
            this.data.customerDetails.variableData.personalDetailsWPhone
              .extension,
          ),
        )
      }
      // this.disabledForm(this.contactInfoForm.controls.selectedProperty.value);
      // this.subscriptions.push(this.contactInfoForm.controls.selectedProperty.valueChanges.subscribe((val) => {
      //    //console.log(val);
      //    this.disabledForm(val);
      // }));

      this.subscriptions.push(
        this.contactInfoForm
          .get('fax')
          .valueChanges.pipe(distinctUntilChanged())
          .subscribe((value: any) => {
            if (value != '' && value != null) {
              this.contactInfoForm
                .get('faxAreaCode')
                .setValidators([Validators.required])
            } else {
              this.contactInfoForm.controls.faxAreaCode.setValidators([
                Validators.required,
              ])
            }
            this.contactInfoForm.get('faxAreaCode').updateValueAndValidity()
          }),
      )
      this.subscriptions.push(
        this.contactInfoForm.controls.phoneNumber.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe((value) => {
            if (value != '' && value != null) {
              this.contactInfoForm.controls.phoneNumberAreaCode.setValidators([
                Validators.required,
              ])
            } else {
              this.contactInfoForm.controls.phoneNumberAreaCode.setValidators(
                null,
              )
            }
            this.contactInfoForm
              .get('phoneNumberAreaCode')
              .updateValueAndValidity()
          }),
      )
      this.subscriptions.push(
        this.contactInfoForm.controls.workNumber.valueChanges
          .pipe(distinctUntilChanged())
          .subscribe((value) => {
            if (value != '' && value != null) {
              this.contactInfoForm.controls.workNumberAreaCode.setValidators([
                Validators.required,
              ])
            } else {
              this.contactInfoForm.controls.workNumberAreaCode.setValidators(
                null,
              )
            }
            this.contactInfoForm
              .get('phoneNumberAreaCode')
              .updateValueAndValidity()
          }),
      )
      this.contactInfoForm.updateValueAndValidity()
    }
  }

  cleanValue(value) {
    if (value) {
      return value.trim()
    }
    return value
  }

  disabledForm(value) {
    this.contactInfoForm.controls.email.disable()
    this.contactInfoForm.controls.mobileNumber.disable()
    this.contactInfoForm.controls.fax.disable()
    this.contactInfoForm.controls.faxAreaCode.disable()
    this.contactInfoForm.controls.faxExtension.disable()
    this.contactInfoForm.controls.phoneNumber.disable()
    this.contactInfoForm.controls.phoneNumberAreaCode.disable()
    this.contactInfoForm.controls.phoneNumberExtension.disable()
    this.contactInfoForm.controls.workNumber.disable()
    this.contactInfoForm.controls.workNumberAreaCode.disable()
    this.contactInfoForm.controls.workNumberExtension.disable()
    switch (value) {
      case 'personalDetailsMail':
        this.contactInfoForm.controls.email.enable()
        break
      case 'personalDetailsMobile':
        this.contactInfoForm.controls.mobileNumber.enable()
        break
      case 'personalDetailsFax':
        this.contactInfoForm.controls.fax.enable()
        this.contactInfoForm.controls.faxAreaCode.enable()
        this.contactInfoForm.controls.faxExtension.enable()
        break
      case 'personalDetailsPhone':
        this.contactInfoForm.controls.phoneNumber.enable()
        this.contactInfoForm.controls.phoneNumberAreaCode.enable()
        this.contactInfoForm.controls.phoneNumberExtension.enable()
        break
      case 'personalDetailsWPhone':
        this.contactInfoForm.controls.workNumber.enable()
        this.contactInfoForm.controls.workNumberAreaCode.enable()
        this.contactInfoForm.controls.workNumberExtension.enable()
        break
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  previous() {
    this.wizardStep = --this.wizardStep
    if (this.wizardStep === 0) {
      this.wizardStep = 1
    }
  }

  nextStep() {
    this.wizardStep = ++this.wizardStep
    //console.log(this.wizardStep);
    if (this.wizardStep > 3) {
      this.wizardStep = 1
    }
  }

  next() {
    switch (this.wizardStep) {
      case 1:
        this.nextStep()
        break
      case 2:
        const updateData = new CompanyDetailsUpdate(this.contactInfoForm.value)
        this.subscriptions.push(
          this.organizationDetailsService
            .updatePersonalDetails(updateData)
            .subscribe((value) => {
              if (value.errorCode == '0') {
                this.nextStep()
              }
            }),
        )
        break
      case 3:
        // Do what neefs to be done and next
        this.ngOnInit()
        this.nextStep()
        this.readOnlyPanel.isCollapsedContent = false
        break
    }
  }

  modify() {
    this.view = ViewType.WIZARD
    this.readOnlyPanel.isCollapsedContent = true
    this.wizardStep = 1
    this.contactInfoForm.markAllAsTouched()
    this.contactInfoForm.updateValueAndValidity()
  }

  cancelModify() {
    this.view = ViewType.DETAIL
    this.readOnlyPanel.isCollapsedContent = false
    this.wizardStep = 1
    this.initFormData()
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
    // const EMAIL_REGEXP = /^[a-zA-Z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/i;
    if (
      control.value != '' &&
      (control.value.length <= 5 || !EMAIL_REGEXP.test(control.value))
    ) {
      return { incorrectMailFormat: true }
    }
    return null
  }
}
