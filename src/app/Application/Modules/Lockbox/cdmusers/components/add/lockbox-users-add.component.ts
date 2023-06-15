import { Component, Inject, Injector, LOCALE_ID, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { LockboxUsersAddService } from './lockbox-users-add.service'

@Component({
  templateUrl: './lockbox-users-add.component.html',
  selector: 'app-lockbox-users-add-component',
})
export class LockboxUsersAddComponent implements OnInit {
  routes: any[] = [
    ['dashboard.lockbox'],
    ['lockbox.cdmUsers.menu', ['/lockbox/cdm-users/list']],
    ['lockbox.cdmUsers.add.menu'],
  ]

  cityList = []

  form: FormGroup

  public entityProperties: any[]
  public combosData: any
  public combosKeys: any[]

  constructor(
    public router: Router,
    public service: LockboxUsersAddService,
    public formBuilder: FormBuilder,
  ) {
    this.combosKeys = ['lockBoxUserRole', 'regionList', 'nationalityYakeenCode']
    this.combosData = {}
    this.combosData['cityList'] = []
    this.combosData['cityList1'] = []
    this.combosData['cityList2'] = []
    this.combosData['cityList3'] = []
    this.combosData['cityList4'] = []
    this.combosData['cityList5'] = []
    this.combosData['cityList6'] = []
    this.combosData['cityList7'] = []
    this.combosData['regionList'] = []
  }

  ngOnInit(): void {
    if (
      !this.service ||
      !this.service.initResponse ||
      !this.service.initResponse.user
    ) {
      this.router.navigate([this.getBackUrl()])
      return
    }
    /*
     * We transform region combo data
     */
    this.service.initResponse.regionList.forEach((region) => {
      this.combosData['regionList'].push({
        key: region['regionPK'],
        value: region['name'],
      })
      /*
       * Adding a combo data for each Region
       * and pushing child cities
       */
      this.combosData['cityList' + region['regionPk']] = this.combosData[
        'cityList' + region['regionPk']
      ]
        ? this.combosData['cityList' + region['regionPk']]
        : []
    })
    /*
     * We transform the city combo
     */
    this.service.initResponse.cityList.forEach((city, i) => {
      const regionKey = city['regionPK']
      const transformedCity = {
        key: city['cityPK'],
        value: city['name'],
      }
      this.combosData['cityList'].push(transformedCity)
      /*
       * Adding a combo data for each Region
       * and pushing child cities
       */
      this.combosData['cityList' + regionKey] = this.combosData[
        'cityList' + regionKey
      ]
        ? this.combosData['cityList' + regionKey]
        : []
      this.combosData['cityList' + regionKey].push(transformedCity)
    })
    this.buildEntityProperties()
  }

  back() {
    this.service.initResponse = null
  }

  buildEntityProperties() {
    this.entityProperties = [
      {
        key: 'arabicName',
        title: 'arabicName',
        translate: 'arabicName',
        type: 'text',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 250,
      },
      {
        key: 'englishName',
        title: 'englishName',
        translate: 'englishName',
        type: 'text',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 250,
      },
      {
        key: 'sponsorNumber',
        title: 'sponsorNumber',
        translate: 'sponsorNumber',
        type: 'text',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 50,
      },
      {
        key: 'sponsorName',
        title: 'sponsorName',
        translate: 'sponsorName',
        type: 'text',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 200,
      },
      {
        key: 'nationality',
        title: 'nationality',
        translate: 'nationality',
        type: 'select',
        required: false,
        default: '',
        validators: [],
        widget: 'select',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        select_combo_key: 'nationalityYakeenCode',
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 40,
      },
      {
        key: 'occupation',
        title: 'occupation',
        translate: 'occupation',
        type: 'text',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 100,
      },
      {
        key: 'civilianId',
        title: 'civilianId',
        translate: 'civilianId',
        type: 'text',
        required: true,
        default: '',
        validators: [],
        widget: '',
        // "select_combo_key":"batchTypes",
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 10,
      },
      {
        key: 'civExpirityDate',
        title: 'civilianExpiryDate',
        translate: 'civilianExpiryDate',
        type: 'date',
        required: false,
        default: '',
        disabled: false,
        widget: 'datepicker-gr',
        widget_datepicker_min_date: false,
        widget_datepicker_max_date: false,
        widget_container_class: 'col-xs-6 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        '_tooltip-visible': false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
      },
      {
        key: 'civIssueDate',
        title: 'civIssueDate',
        translate: 'civIssueDate',
        type: 'date',
        required: false,
        default: '',
        validators: [],
        widget: 'datepicker-gr',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
      },
      {
        key: 'civIssuePlace',
        title: 'civIssuePlace',
        translate: 'civIssuePlace',
        type: 'text',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
        maxlength: 35,
      },
      {
        key: 'dateOfBirth',
        title: 'dateOfBirth',
        translate: 'dateOfBirth',
        type: 'date',
        required: false,
        default: '',
        disabled: false,
        widget: 'datepicker-gr',
        widget_datepicker_min_date: false,
        widget_datepicker_max_date: false,
        widget_container_class: 'col-xs-6 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        '_tooltip-visible': false,
        updatable: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: true,
      },
      {
        key: 'passwordModify',
        title: 'password',
        translate: 'password',
        type: 'text',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        readonly: false,
        maxlength: 64,
      },
      {
        key: 'userId',
        title: 'userId',
        translate: 'userId',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 30,
      },
      {
        key: 'cic',
        title: 'cic',
        translate: 'cic',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 20,
      },
      {
        key: 'role',
        title: 'Role',
        translate: 'role',
        type: 'select',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        select_combo_key: 'lockBoxUserRole',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
      },
      {
        key: 'regionPK',
        title: 'regionPK',
        translate: 'regionPK',
        type: 'select',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        select_combo_key: 'regionList',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
      },
      {
        key: 'cityPK',
        title: 'cityName',
        translate: 'cityName',
        type: 'select',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        select_combo_key: 'cityList',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        select_dependent: true,
        select_parent: 'regionPK',
        select_combo_key_by_parent_value: 'cityList[%value%]',
      },
      {
        key: 'mobile',
        title: 'mobile',
        translate: 'mobile',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        inputPattern: 'onlyMobileNumbers',
        maxlength: 20,
      },
      {
        key: 'email',
        title: 'email',
        translate: 'email',
        type: 'email',
        required: true,
        default: '',
        validators: [Validators.required, this.getValidatorForMailFormat],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        'isFormField ': true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 50,
      },
      {
        key: 'employeeNumber',
        title: 'employeeNumber',
        translate: 'employeeNumber',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 12,
      },
      {
        key: 'position',
        title: 'position',
        translate: 'position',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 50,
      },
      {
        key: 'department',
        title: 'department',
        translate: 'department',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        readonly: false,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 50,
      },
      {
        key: 'storeId',
        title: 'storeId',
        translate: 'storeId',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 60,
      },
      {
        key: 'address',
        title: 'address',
        translate: 'address',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        maxlength: 100,
      },
      {
        key: 'userMaxAmount',
        title: 'userMaxAmount',
        translate: 'userMaxAmount',
        type: 'text',
        required: true,
        default: '',
        validators: [Validators.required],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-4',
        widget_container_init_row: false,
        widget_container_end_row: false,
        updatable: true,
        isFormField: true,
        isForValidate: false,
        isForConfirm: false,
        inputPattern: 'onlyNumbers',
        maxlength: 50,
      },
    ]
    this.setPropertyValue(
      'arabicName',
      this.service.initResponse.user['arabicName'],
    )
    this.setPropertyValue(
      'englishName',
      this.service.initResponse.user['englishName'],
    )
    this.setPropertyValue(
      'sponsorNumber',
      this.service.initResponse.user['sponsorNumber'],
    )
    this.setPropertyValue(
      'sponsorName',
      this.service.initResponse.user['sponsorName'],
    )
    this.setPropertyValue(
      'nationality',
      this.service.initResponse.user['nationality'],
    )
    this.setPropertyValue(
      'occupation',
      this.service.initResponse.user['occupation'],
    )
    this.setPropertyValue(
      'civilianId',
      this.service.initResponse.user['civilianId'],
    )
    this.setPropertyValue(
      'civExpirityDate',
      this.service.initResponse.user['civExpirityDate'],
    )
    this.setPropertyValue(
      'civIssueDate',
      this.service.initResponse.user['civIssueDate'],
    )
    this.setPropertyValue(
      'civIssuePlace',
      this.service.initResponse.user['civIssuePlace'],
    )
    this.setPropertyValue(
      'dateOfBirth',
      this.service.initResponse.user['dateOfBirth'],
    )
    this.setPropertyValue('password', '')
    this.setPropertyValue('userId', this.service.initResponse.user['userId'])
    this.setPropertyValue('cic', this.service.initResponse.user['cic'])
    this.setPropertyValue('role', this.service.initResponse.user['role'])
    this.setPropertyValue(
      'regionPK',
      this.service.initResponse.user['regionPK'],
    )
    this.setPropertyValue('cityPK', this.service.initResponse.user['cityPK'])
    this.setPropertyValue('mobile', this.service.initResponse.user['mobile'])
    this.setPropertyValue('email', this.service.initResponse.user['email'])
    this.setPropertyValue(
      'employeeNumber',
      this.service.initResponse.user['employeeNumber'],
    )
    this.setPropertyValue(
      'position',
      this.service.initResponse.user['position'],
    )
    this.setPropertyValue(
      'department',
      this.service.initResponse.user['department'],
    )
    this.setPropertyValue('storeId', this.service.initResponse.user['storeId'])
    this.setPropertyValue('address', this.service.initResponse.user['address'])
    this.setPropertyValue(
      'userMaxAmount',
      this.service.initResponse.user['userMaxAmount'],
    )
  }

  public getValidatorForMailFormat(control: FormControl) {
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

  setPropertyValue(name, value) {
    this.entityProperties.forEach((element) => {
      if (element['key'] === name) {
        //     if (value && element['type'] === 'date') {
        //         value = this.service.getPropertyDateValue(value);
        //     }

        element['default'] = value
      }
    })
  }

  getBackUrl() {
    return '/lockbox/cdm-users/list'
  }
}
