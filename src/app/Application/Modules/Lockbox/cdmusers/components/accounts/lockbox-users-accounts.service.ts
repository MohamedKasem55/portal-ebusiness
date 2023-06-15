import { HttpClient } from '@angular/common/http'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { Router } from '@angular/router'
import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Observable, of } from 'rxjs'
import { map } from 'rxjs/operators'
import { AbstractActionModifyService } from '../../../../Common/Services/Abstract/abstract-action-modify.service'
import { TranslateService } from '@ngx-translate/core'
import { DatePipe } from '@angular/common'
import { LockboxUsersDetailsService } from '../details/lockbox-users-details.service'

@Injectable()
export class LockboxUsersAccountsService extends AbstractActionModifyService {
  accountsData: any = {}

  validateResponse: any

  constructor(
    protected router: Router,
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) private _locale: string,
    protected translate: TranslateService,
    protected dateService: DatePipe,
    public detailsService: LockboxUsersDetailsService,
  ) {
    super(http, config)
  }

  isSelectItemsAllowed() {
    return true
  }

  public configureAccountsFormModel(detailsData) {
    const _fieldsConfigForForm = []

    _fieldsConfigForForm.push({
      key: 'userId',
      title: 'userId',
      translate: 'userId',
      type: 'text',
      required: false,
      default: detailsData.userId,
      validators: [],
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      readonly: true,
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
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      readonly: true,
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
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: false,
      widget_container_end_row: false,
      updatable: false,
      readonly: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    // -----------

    _fieldsConfigForForm.push({
      key: 'terminalPKHeader',
      title: 'terminalPKHeader',
      translate: 'terminalPKHeader',
      type: 'custom-code',
      required: false,
      default: null,
      validators: [],
      widget_template_name: 'terminalPKHeader',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'terminalPK',
      title: 'terminalPK',
      translate: 'terminalPK',
      type: 'select',
      required: false,
      default: null,
      validators: [],
      select_combo_key: 'terminalList',
      widget_container_class: 'col-xs-12 col-sm-4',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: true,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'terminalAccountsNewList',
      title: 'terminalAccountsNewList',
      translate: 'terminalAccountsNewList',
      type: 'custom-code',
      required: false,
      default: null,
      validators: [],
      widget_template_name: 'terminalAccountsNewList',
      widget_container_class: 'col-xs-12 col-sm-12',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    _fieldsConfigForForm.push({
      key: 'terminalAccountsAssignedList',
      title: 'terminalAccountsAssignedList',
      translate: 'terminalAccountsAssignedList',
      type: 'custom-code',
      required: false,
      default: null,
      validators: [],
      widget_template_name: 'terminalAccountsAssignedList',
      widget_container_class: 'col-xs-12 col-sm-12',
      widget_container_init_row: true,
      widget_container_end_row: true,
      updatable: false,
      isFormField: true,
      isForValidate: true,
      isForConfirm: true,
    })

    return _fieldsConfigForForm
  }

  protected createInitRequest(values: any): Observable<any> {
    const params = {
      user: values,
    }

    this.accountsData = null

    return this.http
      .post(this.servicesUrl + '/lockbox/userManagement/accounts/init', params)
      .pipe(
        map((result: any) => {
          if (result.errorCode == '0') {
            this.accountsData = result
          }
          return result
        }),
      )
  }

  public getSelectedItemAccountsData() {
    return this.accountsData
  }

  protected createValidateRequest(values: any): Observable<any> {
    this.validateResponse = {}

    const params = {
      user: this.detailsService.getSelectedItem(),
      userData: this.detailsService.getSelectedItemDetailsData(),
      accountsData: this.accountsData,
      formData: values,
    }

    this.validateResponse = params

    return of({
      errorCode: '0',
      user: values,
    })
  }

  protected createConfirmRequest(values: any): Observable<any> {
    const params = {
      user: this.validateResponse.user,
      terminal: this.validateResponse.formData.terminalPK,
      addAccountList:
        this.validateResponse.accountsData.terminalAccountsListNewSelected,
      deleteAccountList: [],
    }

    this.validateResponse.accountsData.lockBoxUserTerminalAccountsAssignedList.forEach(
      (a) => {
        const find =
          this.validateResponse.accountsData.terminalAccountsListAssginedSelected.find(
            (f) => f.accountNumber == a.accountNumber,
          )
        if (!find) {
          params.deleteAccountList.push(a)
        }
      },
    )

    return this.http.post(
      this.config.getServicesUrl() + '/lockbox/userManagement/accounts/confirm',
      params,
    )
  }

  getTerminalList(values: any): Observable<any> {
    const params = {
      search: true,
      radiobutton: 2,
      terminalPk: values ? values.terminalID : null,
      page: 1,
      rows: 100,
    }
    return this.http.post(
      this.config.getServicesUrl() + '/lockbox/accountManagement/list/search',
      params,
    )
  }

  back(route: string) {
    this.router.navigate([route])
  }

  // ---------------------------

  public getTerminalAccountsFieldsConfigForList1(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'fullAccountNumber',
        propName: 'fullAccountNumber',
        propValue: (row, service, combosData) => row.fullAccountNumber,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.accountNumber',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 200,
        export_column_width: 150,
      },
      {
        key: 'ccdmAlias',
        propName: 'ccdmAlias',
        propValue: (row, service, combosData) => row.ccdmAlias,
        translate: 'lockbox.cdmUsers.details.terminalAccounts.accountNickName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
    ]

    return _fieldsConfigForList
  }

  public getTerminalAccountsFieldsConfigForExport1() {
    const exportColumns = []
    this.getTerminalAccountsFieldsConfigForList1().forEach((_fieldConfig) => {
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

  public getTerminalAccountsFieldsConfigForList2(): any[] {
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

  public getTerminalAccountsFieldsConfigForExport2() {
    const exportColumns = []
    this.getTerminalAccountsFieldsConfigForList2().forEach((_fieldConfig) => {
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
