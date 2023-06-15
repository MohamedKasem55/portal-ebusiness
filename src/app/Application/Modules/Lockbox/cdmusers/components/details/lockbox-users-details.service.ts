import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { AbstractActionDetailsService } from '../../../../Common/Services/Abstract/abstract-action-details.service'
import { DatePipe } from '@angular/common'
import { TranslateService } from '@ngx-translate/core'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'
import { map } from 'rxjs/operators'

@Injectable()
export class LockboxUsersDetailsService extends AbstractActionDetailsService {
  detailsData: any = {}

  constructor(
    protected translate: TranslateService,
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected dateService: DatePipe,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
  ) {
    super(http, config)
  }

  public configureDetailsFormModel(detailsData) {
    const _fieldsConfigForForm = []

    _fieldsConfigForForm.push({
      key: 'userId',
      title: 'userId',
      translate: 'userId',
      type: 'text',
      required: false,
      default: detailsData.userId,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'arabicName',
      title: 'arabicName',
      translate: 'arabicName',
      type: 'text',
      required: false,
      default: detailsData.arabicName,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      readonly: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'englishName',
      title: 'englishName',
      translate: 'englishName',
      type: 'text',
      required: false,
      default: detailsData.englishName,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      readonly: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'role',
      title: 'role',
      translate: 'role',
      type: 'select',
      required: false,
      default: detailsData.role,
      validators: [],
      select_combo_key: 'lockBoxUserRole',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civilianId',
      title: 'civilianId',
      translate: 'civilianId',
      type: 'text',
      required: false,
      default: detailsData.civilianId,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civExpirityDate',
      title: 'civExpirityDate',
      translate: 'civExpirityDate',
      type: 'date',
      required: false,
      // default: new DateFormatPipe(this.injector, this._locale).transform(detailsData.civExpirityDate, 'dd/MM/yyyy'),
      default: detailsData.civExpirityDate,
      validators: [],
      widget: 'datepicker-gr',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'dateOfBirth',
      title: 'dateOfBirth',
      translate: 'dateOfBirth',
      type: 'date',
      required: false,
      default: detailsData.dateOfBirth,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: false,
      default: detailsData.status,
      validators: [],
      select_combo_key: 'lockBoxUserStatus',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'regionPK',
      title: 'regionPK',
      translate: 'regionPK',
      type: 'select',
      required: false,
      default: detailsData.regionPK,
      validators: [],
      select_combo_key: 'regionList',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'cityPK',
      title: 'cityPK',
      translate: 'cityPK',
      type: 'select',
      required: false,
      default: detailsData.cityPK,
      validators: [],
      select_combo_key: 'cityList',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'mobile',
      title: 'mobile',
      translate: 'mobile',
      type: 'text',
      required: false,
      default: detailsData.mobile,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'email',
      title: 'email',
      translate: 'email',
      type: 'text',
      required: false,
      default: detailsData.email,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'employeeNumber',
      title: 'employeeNumber',
      translate: 'employeeNumber',
      type: 'text',
      required: false,
      default: detailsData.employeeNumber,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'position',
      title: 'position',
      translate: 'position',
      type: 'text',
      required: false,
      default: detailsData.position,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'department',
      title: 'department',
      translate: 'department',
      type: 'text',
      required: false,
      default: detailsData.department,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'storeId',
      title: 'storeId',
      translate: 'storeId',
      type: 'text',
      required: false,
      default: detailsData.storeId,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'address',
      title: 'address',
      translate: 'address',
      type: 'text',
      required: false,
      default: detailsData.address,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'sponsorNumber',
      title: 'sponsorNumber',
      translate: 'sponsorNumber',
      type: 'text',
      required: false,
      default: detailsData.sponsorNumber,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'sponsorName',
      title: 'sponsorName',
      translate: 'sponsorName',
      type: 'text',
      required: false,
      default: detailsData.sponsorName,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'nationality',
      title: 'nationality',
      translate: 'nationality',
      type: 'text',
      required: false,
      default: detailsData.nationality,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'occupation',
      title: 'occupation',
      translate: 'occupation',
      type: 'text',
      required: false,
      default: detailsData.occupation,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civIssueDate',
      title: 'civIssueDate',
      translate: 'civIssueDate',
      type: 'date',
      required: false,
      default: detailsData.civIssueDate,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'civIssuePlace',
      title: 'civIssuePlace',
      translate: 'civIssuePlace',
      type: 'text',
      required: false,
      default: detailsData.civIssuePlace,
      validators: [],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'userMaxAmount',
      title: 'userMaxAmount',
      translate: 'userMaxAmount',
      type: 'text',
      required: false,
      default: detailsData.userMaxAmount,
      validators: [],
      inputPattern: 'onlyPositiveDecimalNumbers',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'userFingerPrint',
      title: 'userFingerPrint',
      translate: 'userFingerPrint',
      type: 'text',
      required: false,
      default: detailsData.userFingerPrint,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'terminalAccountsList',
      title: 'terminalAccountsList',
      translate: 'terminalAccountsList',
      type: 'custom-code',
      required: false,
      default: null,
      validators: [],
      widget_template_name: 'terminalAccountsList',
      widget_container_class: 'col-xs-12 col-sm-12',
      widget_container_init_row: true,
      widget_container_end_row: false,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    return _fieldsConfigForForm
  }

  protected createInitRequest(): Observable<any> {
    return undefined
  }

  protected createDetailRequest(values: any): Observable<any> {
    const params = {
      lbUserPK: values.lbUserPK,
    }

    this.detailsData = null

    return this.http
      .post(this.servicesUrl + '/lockbox/userManagement/details', params)
      .pipe(
        map((result: any) => {
          if (result.errorCode == '0') {
            this.detailsData = result
          }
          return result
        }),
      )
  }

  getSelectedItemDetailsData() {
    return this.detailsData
  }

  back(route: string) {
    this.router.navigate([route])
  }

  // ---------------------------

  public getTerminalAccountsFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'terminalPk',
        propName: 'terminalPk',
        propValue: (row, service, combosData) => row.terminalPk,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.terminalPk',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 120,
        export_column_width: 100,
      },
      {
        key: 'terminalName',
        propName: 'terminalName',
        propValue: (row, service, combosData) => row.terminalName,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.terminalName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'regionName',
        propName: 'regionName',
        propValue: (row, service, combosData) => row.regionName,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.regionName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 120,
        export_column_width: 100,
      },
      {
        key: 'cityName',
        propName: 'cityName',
        propValue: (row, service, combosData) => row.cityName,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.cityName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 120,
        export_column_width: 100,
      },
      {
        key: 'location1',
        propName: 'location1',
        propValue: (row, service, combosData) => row.location1,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.location1',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'location2',
        propName: 'location2',
        propValue: (row, service, combosData) => row.location2,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.location2',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'terminalStatus',
        propName: 'terminalStatus',
        propValue: (row, service, combosData) => {
          const list = combosData['lockBoxTerminalStatus']
            ? combosData['lockBoxTerminalStatus']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.terminalStatus)
          if (elem != null) {
            return elem.value
          }
          return row.terminalStatus
        },
        translate: 'lockbox.cdmUsers.details.terminalAccounts.terminalStatus',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 80,
        export_column_width: 80,
      },
      {
        key: 'accountNumber',
        propName: 'accountNumber',
        propValue: (row, service, combosData) => row.accountNumber,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.accountNumber',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 200,
        export_column_width: 150,
      },
      {
        key: 'accountNickName',
        propName: 'accountNickName',
        propValue: (row, service, combosData) => row.accountNickName,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.accountNickName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
    ]

    return _fieldsConfigForList
  }

  public getTerminalAccountsFieldsConfigForExport() {
    const exportColumns = []
    this.getTerminalAccountsFieldsConfigForList().forEach((_fieldConfig) => {
      if (
        _fieldConfig.hasOwnProperty('export') &&
        _fieldConfig.export === true
      ) {
        exportColumns.push({
          title: this.translate.instant(_fieldConfig.translate),
          dataKey: _fieldConfig.exportKey
            ? _fieldConfig.exportKey
            : _fieldConfig.key,
          width: _fieldConfig.export_column_width
            ? _fieldConfig.export_column_width
            : _fieldConfig.width
            ? _fieldConfig.width
            : '*',
        })
      }
    })
    return exportColumns
  }
}
