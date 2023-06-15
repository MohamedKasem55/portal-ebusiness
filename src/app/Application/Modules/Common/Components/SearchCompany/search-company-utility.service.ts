import { DatePipe } from '@angular/common'
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { AbstractListService } from '../../Services/Abstract/abstract-list.service'

@Injectable()
export class SearchCompanyUtilityService extends AbstractListService {
  private _searchType

  private _payrollType

  comboDataList = []

  constructor(
    protected translate: TranslateService,
    protected dateService: DatePipe,
    protected http: HttpClient,
    public config: ConfigResourceService,
  ) {
    super(http, config)
  }

  //----------------------------------------------------------------------

  public setSearchType(value) {
    this._searchType = value
  }

  public setPayrollType(value) {
    this._payrollType = value
  }

  public getSearchType() {
    return this._searchType
  }

  public getPayrollType() {
    return this._payrollType
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'profileNumber',
        propName: 'profileNumber',
        propValue: (row, service, combosData) =>
          this.getUnescapedStr(row.profileNumber),
        translate: 'public.searchCompany.companyProfile',
        link_to_detail: true,
        parent_div_class: 'col-xs-6',
        export: true,
        width: 'auto',
      },
      {
        key: 'companyName',
        propName: 'companyName',
        propValue: (row, service, combosData) =>
          this.getUnescapedStr(row.companyName),
        translate: 'public.searchCompany.companyName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'organizationType',
        propName: 'organizationType',
        propValue: (row, service, combosData) => {
          const list = combosData['organizationType']
            ? combosData['organizationType']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.organizationType)
          if (elem != null) {
            return this.getUnescapedStr(elem.value)
          }
          return this.getUnescapedStr(row.organizationType)
        },
        translate: 'public.searchCompany.organizationType',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'organizationTypeExport',
        width: 'auto',
      },
      {
        key: 'register',
        propName: 'register',
        propValue: (row, service, combosData) => {
          const list = combosData['process'] ? combosData['process'] : []
          let elem = null
          elem = list.find((item) => item.key == row.register)
          if (elem != null) {
            return this.getUnescapedStr(elem.value)
          }
          return row.register
        },
        translate: 'public.searchCompany.register',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'registerExport',
        width: 'auto',
      },
      {
        key: 'status',
        propName: 'status',
        propValue: (row, service, combosData) => {
          const list = combosData['processStatus']
            ? combosData['processStatus']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.status)
          if (elem != null) {
            return this.getUnescapedStr(elem.value)
          }
          return this.getUnescapedStr(row.status)
        },
        translate: 'public.searchCompany.status',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'statusExport',
        width: 'auto',
      },
      {
        key: 'registrationDate',
        propName: 'registrationDate',
        propValue: (row, service, combosData) =>
          this.dateService.transform(row.registrationDate, 'dd/MM/yyyy'), // date
        translate: 'public.searchCompany.registrationDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        dateFormat: 'dd/MM/yyyy',
        width: 'auto',
      },
      {
        key: 'lastBranchAdmin',
        propName: 'lastBranchAdmin',
        propValue: (row, service, combosData) =>
          this.getUnescapedStr(row.lastBranchAdmin),
        translate: 'public.searchCompany.lastBranchAdmin',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        width: 'auto',
      },
      {
        key: 'lastActionTimestamp',
        propName: 'lastActionTimestamp',
        propValue: (row, service, combosData) =>
          this.dateService.transform(
            row.registrationDate,
            'dd/MM/yyyy HH:mm:ss',
          ), // date
        translate: 'public.searchCompany.lastActionTimestamp',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        dateFormat: 'dd/MM/yyyy HH:mm:ss',
        //exportKey: '_lastActionTimestamp',
        width: 'auto',
      },
      {
        key: 'branchRbs5',
        propName: 'branchRbs5',
        propValue: (row, service, combosData) =>
          row.branchRbs5 +
          ' - ' +
          (this.translate.currentLang == 'ar'
            ? row.branchName
            : row.branchNameEn),
        translate: 'public.searchCompany.branchRbs5',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'branchRbs5Export',
      },
      {
        key: 'originatorId',
        propName: 'originatorId',
        propValue: (row, service, combosData) => row.originatorId,
        translate: 'public.searchCompany.originatorId',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
    ]

    if (this._searchType == 'REGISTERED') {
      _fieldsConfigForList.push({
        key: 'payrollRegistered',
        propName: 'payrollRegistered',
        propValue: (row, service, combosData) => {
          switch (this._payrollType) {
            case 'P':
              return this.translate.instant(
                'public.searchCompany.registered' +
                  (row.payrollRegistered ? 'Yes' : 'No'),
              )
            case 'W':
              return this.translate.instant(
                'public.searchCompany.registered' +
                  (row.wpsPayrollRegistered ? 'Yes' : 'No'),
              )
            case 'B':
              return this.translate.instant(
                'public.searchCompany.registered' +
                  (row.bulkPaymentsParameters &&
                  row.bulkPaymentsParameters.bulkPaymentsRegistered == 'Y'
                    ? 'Yes'
                    : 'No'),
              )
            case 'HU':
              return this.translate.instant(
                'public.searchCompany.registered' +
                  (row.companyHajjUmrah && row.companyHajjUmrah.hajjRegistered
                    ? 'Yes'
                    : 'No'),
              )
            case 'VA':
              return this.translate.instant(
                'public.searchCompany.registered' +
                  (row.vaClientId != null ? 'Yes' : 'No'),
              )
            default:
              return ''
          }
        },
        translate: 'public.searchCompany.registered',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
      })
    }

    return _fieldsConfigForList
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForSearchForm(): any[] {
    const _fieldsConfigForSearchForm: any[] = []

    _fieldsConfigForSearchForm.push({
      key: 'branch',
      title: 'branch',
      translate: 'branch',
      type: 'select',
      required: true,
      default: null,
      validators: [],
      select_combo_key: 'branches',
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-5',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    if (this._searchType == 'REGISTERED') {
      _fieldsConfigForSearchForm.push({
        key: 'registered',
        title: 'registered',
        translate: 'registered',
        type: 'checkbox',
        required: false,
        default: '',
        validators: [],
        widget: '',
        widget_container_class: 'col-xs-12 col-sm-2',
        widget_container_init_row: false,
        widget_container_end_row: false,
      })
    }

    _fieldsConfigForSearchForm.push({
      key: 'includeBlocked',
      title: 'includeBlocked',
      translate: false,
      type: 'checkbox',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_inline: 'includeBlocked',
    })

    _fieldsConfigForSearchForm.push({
      key: 'includeDeleted',
      title: 'includeDeleted',
      translate: false,
      type: 'checkbox',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-2',
      widget_container_init_row: false,
      widget_container_end_row: false,
      translate_inline: 'includeDeleted',
    })

    _fieldsConfigForSearchForm.push({
      key: 'process',
      title: 'process',
      translate: 'process',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      select_combo_key: 'process',
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'companyNumber',
      title: 'companyNumber',
      translate: 'companyNumber',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      maxlength: 10,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'companyName',
      title: 'companyName',
      translate: 'companyName',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      maxlength: 70,
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'organizationType',
      title: 'organizationType',
      translate: 'organizationType',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      select_combo_key: 'organizationType',
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      select_combo_key: 'processStatus',
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'searchByPrivilege',
      title: 'searchByPrivilege',
      translate: false,
      type: 'checkbox',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      translate_inline: 'searchByPrivilege',
      mask_fields_to_show: {
        '': [],
        false: [],
        true: ['privilegeId', 'privilegeActive'],
      },
    })

    _fieldsConfigForSearchForm.push({
      key: 'privilegeId',
      title: 'privilegeId',
      translate: 'privilegeId',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      select_combo_key: 'privileges',
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'privilegeActive',
      title: 'privilegeActive',
      translate: 'privilegeActive',
      type: 'checkbox',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    return _fieldsConfigForSearchForm
  }

  public isSelectItemsAllowed(): boolean {
    return false
  }

  //----------------------------------------------------------------------

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params = {
      search: true,

      branch: criteria.branch ? criteria.branch : '00000',
      searchType: this._searchType,

      companyName: criteria.companyName != '' ? criteria.companyName : null,
      companyNumber:
        criteria.companyNumber != '' ? criteria.companyNumber : null,

      includeBlocked:
        criteria.includeBlocked != '' ? criteria.includeBlocked : false,
      includeDeleted:
        criteria.includeDeleted != '' ? criteria.includeDeleted : false,

      organizationType:
        criteria.organizationType != '' ? criteria.organizationType : null,

      searchByPrivilege:
        criteria.searchByPrivilege != '' ? criteria.searchByPrivilege : false,
      privilegeActive:
        criteria.privilegeActive != '' ? criteria.privilegeActive : false,
      privilegeId: criteria.privilegeId != '' ? criteria.privilegeId : null,

      status: criteria.status != '' ? criteria.status : null,
      process: criteria.process != '' ? criteria.process : null,
      registered: criteria.registered != '' ? criteria.registered : null,

      order,
      orderType,
      page,
      rows,
    }

    return this.http.post(this.servicesUrl + '/managementCompany/list', params)
  }

  protected getOutputFromRequestedData(_body) {
    return {
      data: {
        items: _body.companyList.items,
        size: _body.companyList.size,
        total: _body.companyList.total,
      },
      size: _body.companyList.size,
      total: _body.companyList.total,
    }
  }

  protected postProcessOutputFromRequestedData(output): any {
    output = super.postProcessOutputFromRequestedData(output)
    const _fieldsConfigForList = this.getFieldsConfigForList()
    if (output.data.items && output.data.items.length >= 0) {
      _fieldsConfigForList.forEach((_fieldConfig) => {
        if (
          _fieldConfig.hasOwnProperty('export') &&
          _fieldConfig.export === true &&
          _fieldConfig.exportKey
        ) {
          output.data.items.forEach((item) => {
            const exportDataKey = _fieldConfig.exportKey
            item[exportDataKey] = _fieldConfig.propValue(
              item,
              this,
              this.comboDataList,
            )
          })
        }
      })
    }
    return output
  }

  public branches(): Observable<any> {
    return this.http.get(this.servicesUrl + '/branch/list')
  }

  public getExportColumns() {
    const exportColumns = []
    this.getFieldsConfigForList().forEach((_fieldConfig) => {
      if (
        _fieldConfig.hasOwnProperty('export') &&
        _fieldConfig.export === true
      ) {
        exportColumns.push(
          Object.assign({}, _fieldConfig, {
            title: this.translate.instant(_fieldConfig.translate),
            dataKey: _fieldConfig.exportKey
              ? _fieldConfig.exportKey
              : _fieldConfig.key,
            modelKey: _fieldConfig.modelKey,
            width: _fieldConfig.export_column_width
              ? _fieldConfig.export_column_width
              : _fieldConfig.width
              ? _fieldConfig.width
              : '*',
          }),
        )
      }
    })
    return exportColumns
  }

  public getExportHeader() {
    return this.translate.instant('managementCompanyAdmin.companyList')
  }

  public showExportButtons() {
    return false
  }
}
