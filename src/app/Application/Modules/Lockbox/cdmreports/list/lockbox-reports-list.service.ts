import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'
import { NavigationEnd, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { DatePipe } from '@angular/common'
import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { HttpClient } from '@angular/common/http'
import { Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { map } from 'rxjs/operators'

@Injectable()
export class LockboxReportsListService extends AbstractListService {
  combosData: any = {}
  chartData: any = {}
  lastSearchFormData: any = null
  private previousUrl: string
  private currentUrl: string

  constructor(
    protected translate: TranslateService,
    protected dateService: DatePipe,
    protected http: HttpClient,
    public config: ConfigResourceService,
    private injector: Injector,
    private router: Router,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    super(http, config)

    this.currentUrl = this.router.url
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl
        this.currentUrl = event.url
      }
    })
  }

  //----------------------------------------------------------------------

  public getPreviousUrl() {
    return this.previousUrl
  }

  setCombosData(combosData: any) {
    this.combosData = combosData
  }

  /**
   * Returns search form fields definitions
   */
  /**
   * Returns search form fields definitions
   */
  public getFieldsConfigForSearchForm(): any[] {
    const _fieldsConfigForSearchForm: any[] = []

    _fieldsConfigForSearchForm.push({
      key: 'search',
      title: 'search',
      translate: 'search',
      type: 'hidden',
      required: false,
      default: true,
      validators: [],
      widget: '',
      widget_container_class: 'hidden',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })

    _fieldsConfigForSearchForm.push({
      key: 'terminalID',
      title: 'terminalID',
      translate: 'terminalID',
      type: 'select',
      required: true,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      select_combo_key: 'terminals',
    })
    _fieldsConfigForSearchForm.push({
      key: 'regionPK',
      title: 'regionPK',
      translate: 'region',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      select_combo_key: 'regions',
    })
    _fieldsConfigForSearchForm.push({
      key: 'cityPK',
      title: 'cityPK',
      translate: 'city',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      select_combo_key: 'cities',
    })
    _fieldsConfigForSearchForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: true,
      default: '1',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      select_combo_key: 'lockBoxTerminalReportStatus',
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const currentDateObj = new Date()
    const currentDate = this.dateService.transform(
      currentDateObj,
      'dd/MM/yyyy HH:mm:ss',
    )
    const _fieldsConfigForList: any[] = [
      {
        key: 'terminalName',
        propName: 'terminalName',
        propValue: (row, service, combosData) => row.terminalName,
        translate: 'lockbox.cdmReports.terminalName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 100,
      },
      {
        key: 'status',
        propName: 'status',
        propValue: (row, service, combosData) =>
          // const list = combosData['lockBoxTerminalReportStatus'] ? combosData['lockBoxTerminalReportStatus'] : [];
          // let elem = null;
          // elem = list.find((item) => item.key == row.status);
          // if (elem != null) {
          //     return elem.value;
          // }
          row.machine.status,
        translate: 'lockbox.cdmReports.status',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'statusExport',
        column_width: 150,
      },
      {
        key: 'site',
        propName: 'site',
        propValue: (row, service, combosData) =>
          new DOMParser().parseFromString(row.site.cityName, 'text/html')
            .documentElement.textContent,
        translate: 'lockbox.cdmReports.site',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'cityNameExport',
        column_width: 150,
      },
      {
        key: 'location1',
        propName: 'location1',
        propValue: (row, service, combosData) => row.site.location1,
        translate: 'lockbox.cdmReports.location1',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'location1Export',
        column_width: 150,
      },
      {
        key: 'currentDate',
        propName: 'currentDate',
        propValue: (row, service, combosData) => currentDate, // date
        translate: 'lockbox.cdmReports.currentDate',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 150,
      },
    ]

    return _fieldsConfigForList
  }

  //----------------------------------------------------------------------

  public isEmpty(value): boolean {
    return value === null || value === undefined || value === ''
  }

  public isSelectItemsAllowed(): boolean {
    return true
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

  //----------------------------------------------------------------------

  protected createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any> {
    const params = {
      page,
      rows,
    }

    params['search'] = criteria.search ? true : false

    if (!this.isEmpty(criteria.profileNumber)) {
      params['profileNumber'] = criteria.profileNumber
    }
    if (!this.isEmpty(criteria.customerName)) {
      params['customerName'] = criteria.customerName
    }
    if (!this.isEmpty(criteria.terminalID)) {
      params['terminalID'] = criteria.terminalID
    }
    if (!this.isEmpty(criteria.regionPK)) {
      params['regionPK'] = criteria.regionPK
    }
    if (!this.isEmpty(criteria.cityPK)) {
      params['regionPK'] = criteria.cityPK
    }

    if (!this.isEmpty(criteria.status)) {
      params['status'] = criteria.status
    }

    // const params = {"page":1,"rows":50,"search":true,"profileNumber":"0000015850","terminalID":"GTP-NEW2","regionPK":2,"status":"1"};
    return this.http
      .post(this.servicesUrl + '/lockbox/reports/list', params)
      .pipe(
        map((response) => {
          if (response['errorCode'] == '0') {
            this.chartData = {
              totalUp: response['totalUp'],
              totalWarning: response['totalWarning'],
              totalError: response['totalError'],
              upPercentage: response['upPercentage'],
              warningPercentage: response['warningPercentage'],
              errorPercentage: response['errorPercentage'],
            }
          }
          return response
        }),
      )
  }

  protected getOutputFromRequestedData(_body) {
    const _fieldsConfigForList = this.getFieldsConfigForList()
    if (
      _body.lockBoxTerminalList.items &&
      _body.lockBoxTerminalList.items.length >= 0
    ) {
      _body.lockBoxTerminalList.items.forEach((item, index, self) => {
        _fieldsConfigForList.forEach((_fieldConfig) => {
          if (
            _fieldConfig.hasOwnProperty('export') &&
            _fieldConfig.export === true &&
            _fieldConfig.exportKey
          ) {
            const exportDataKey = _fieldConfig.exportKey
            item[exportDataKey] = _fieldConfig.propValue(
              item,
              this,
              this.combosData,
            )
          }
        })
      })
    }

    return {
      data: {
        items: _body.lockBoxTerminalList.items,
        size: _body.lockBoxTerminalList.size,
        total: _body.lockBoxTerminalList.total,
      },
      size: _body.lockBoxTerminalList.size,
      total: _body.lockBoxTerminalList.total,
    }
  }

  public getExportHeader() {
    return this.translate.instant('lockbox.cdmReports.list')
  }

  public showExportButtons() {
    return true
  }

  public getTerminals(): Observable<any> {
    // status: "1" -> Active
    const params = {
      /*page: 1,
      rows: 100,
      orderType: 'asc',*/
    }
    return this.http.get(this.servicesUrl + '/lockbox/terminals')
  }

  public getRegions(): Observable<any> {
    return this.http.get(this.servicesUrl + '/lockbox/reports/init')
  }

  public getCities(regionPk): Observable<any> {
    const params = {
      regionPK: regionPk,
      page: 1,
      rows: 100,
    }
    return this.http.post(
      this.servicesUrl + '/lockbox/reports/city/list',
      params,
    )
  }

  public getReportDetail(terminal): Observable<any> {
    const params = {
      terminalId: terminal.terminalID,
    }
    return this.http.post(this.servicesUrl + '/lockbox/reports/detail', params)
  }
}
