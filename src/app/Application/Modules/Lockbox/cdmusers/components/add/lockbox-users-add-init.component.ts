import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { LockboxUsersAddService } from './lockbox-users-add.service'

@Component({
  selector: 'app-lockboxuser-add-init',
  templateUrl: './lockbox-users-add-init.component.html',
})
export class LockboxUsersAddInitComponent implements OnInit {
  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.add.menu'],
  ]

  form: FormGroup
  entityProperties: any

  constructor(
    public router: Router,
    public service: LockboxUsersAddService,
    public formBuilder: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({})
    this.entityProperties = this.buildEntityProperties()
  }

  proceed() {
    this.service.currentUser = Object.assign({}, this.form.value)
    this.service.initAdd(this.service.currentUser).subscribe((result) => {
      if (result.errorCode && result.errorCode == '0') {
        this.service.initResponse = result
        this.router.navigate(['/lockbox/cdm-users/add'])
      }
    })
  }

  back() {
    this.router.navigate(['/lockbox/cdm-users/list'])
  }

  buildEntityProperties() {
    return [
      {
        key: 'civilianId',
        title: 'Civilian ID',
        translate: 'civilianId',
        type: 'text',
        required: true,
        default: '',
        validators: [
          Validators.required,
          Validators.maxLength(10),
          this.getValidatorForSAID,
          Validators.pattern('^[0-9]*$'),
        ],
        inputPattern: 'onlyNumbers',
        widget: '',
        // "select_combo_key":"batchTypes",
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        maxlength: 10,
      },
      {
        key: 'civilianExpiryDate',
        title: 'Civilian ID Expirate date From',
        translate: 'civilianExpiryDate',
        type: 'date',
        required: true,
        default: '',
        disabled: false,
        widget: 'datepicker-gr',
        widget_datepicker_min_date: false,
        widget_datepicker_max_date: false,
        widget_container_class: 'col-xs-6 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        '_tooltip-visible': false,
      },
      {
        key: 'dateOfBirth',
        title: 'dateOfBirth',
        translate: 'dateOfBirth',
        type: 'date',
        required: true,
        default: '',
        disabled: false,
        widget: 'datepicker-gr',
        widget_datepicker_min_date: false,
        widget_datepicker_max_date: true,
        widget_container_class: 'col-xs-6 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        '_tooltip-visible': false,
      },
    ]
  }

  protected getValidatorForSAID(control: FormControl): any {
    if (
      control === null ||
      control === undefined ||
      control.value === null ||
      control.value === undefined
    ) {
      return null
    }
    let id = control.value
    id = id ? id.trim() : ''
    if (id === null || id === undefined || id === '') {
      return null
    } else {
      if (Number(id) === null) {
        return { 'incorrecId-Iqama': true }
      }
      if (id.length !== 10 && id.length !== 0) {
        return { incorrecFormatId: true }
      }
      const _type = id.substr(0, 1)
      if (_type !== '2' && _type !== '1') {
        return { invalidId: true }
      }
      let sum = 0
      for (let i = 0; i < 10; i++) {
        if (i % 2 === 0) {
          const ZFOdd = String(
            '00' + String(Number(id.substr(i, 1)) * 2),
          ).slice(-2)
          sum += Number(ZFOdd.substr(0, 1)) + Number(ZFOdd.substr(1, 1))
        } else {
          sum += Number(id.substr(i, 1))
        }
      }
      // result equal 1 is Saudi ID
      // result equal 2 is Iqama ID
      const value = parseInt(sum % 10 !== 0 ? -1 : _type, 10)
      //return value > 0 ? null : { 'incorrecId-Iqama': true }
      return value > 0 ? null : { invalidId: true }
    }
  }
}
