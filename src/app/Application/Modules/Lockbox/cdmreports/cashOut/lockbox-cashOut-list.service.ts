import { ConfigResourceService } from '../../../../../core/config/config.resource.local'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { AbstractListService } from '../../../Common/Services/Abstract/abstract-list.service'
import { HttpClient } from '@angular/common/http'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { DatePipe } from '@angular/common'
import { Validators } from '@angular/forms'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'

@Injectable()
export class LockboxCashOutListService extends AbstractListService {
  combosData: any = {}
  terminalSelected: any = {}

  constructor(
    protected translate: TranslateService,
    protected dateService: DatePipe,
    protected http: HttpClient,
    public config: ConfigResourceService,
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    super(http, config)
  }

  //----------------------------------------------------------------------

  setCombosData(combosData: any) {
    this.combosData = combosData
  }

  setSelectedTerminal(terminal: any) {
    this.terminalSelected = terminal
  }

  /**
   * Returns search form fields definitions
   */
  public getFieldsConfigForSearchForm(): any[] {
    const _fieldsConfigForSearchForm: any[] = []

    _fieldsConfigForSearchForm.push({
      key: 'dateFrom',
      title: 'dateFrom',
      translate: 'dateFrom',
      type: 'date',
      required: true,
      default: '',
      validators: [Validators.required],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
    })
    _fieldsConfigForSearchForm.push({
      key: 'dateTo',
      title: 'dateTo',
      translate: 'dateTo',
      type: 'date',
      required: true,
      default: '',
      validators: [Validators.required],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'terminalNum',
        propName: 'terminalNum',
        propValue: (row, service, combosData) => row.terminalNum,
        translate: 'lockBox.cdmReports.id',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'refNumber',
        propName: 'refNumber',
        propValue: (row, service, combosData) => row.refNumber,
        translate: 'lockBox.cdmReports.refNumber',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'batchId',
        propName: 'batchId',
        propValue: (row, service, combosData) => row.batchId,
        translate: 'lockBox.cdmReports.batchId',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'currency',
        propName: 'currency',
        propValue: (row, service, combosData) => row.currency,
        translate: 'lockBox.cdmReports.currency',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        exportKey: 'currencyExport',
      },
      {
        key: 'amtVal',
        propName: 'amtVal',
        propValue: (row, service, combosData) => row.amtVal,
        translate: 'lockBox.cdmReports.autoAmount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'trxDtTm',
        propName: 'trxDtTm',
        propValue: (row, service, combosData) => row.trxDtTm,
        translate: 'lockBox.cdmReports.time',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
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

    // params['search'] = criteria.search ? true : false;
    if (!this.isEmpty(criteria.dateFrom)) {
      params['dateFrom'] = new DateFormatPipe(
        this.injector,
        this.locale,
      ).transform(criteria.dateFrom, 'yyyy-MM-dd')
    }
    if (!this.isEmpty(criteria.dateTo)) {
      params['dateTo'] = new DateFormatPipe(
        this.injector,
        this.locale,
      ).transform(criteria.dateTo, 'yyyy-MM-dd')
    }

    params['lockBoxTerminal'] = this.terminalSelected

    return this.http.post(
      this.servicesUrl + '/managementLockBox/cdm-reports/cashOut/list',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    const _fieldsConfigForList = this.getFieldsConfigForList()
    if (
      _body.lockBoxCashOutList.items &&
      _body.lockBoxCashOutList.items.length >= 0
    ) {
      _body.lockBoxCashOutList.items.forEach((item, index, self) => {
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
        items: _body.lockBoxCashOutList.items,
        size: _body.lockBoxCashOutList.size,
        total: _body.lockBoxCashOutList.total,
      },
      size: _body.lockBoxCashOutList.size,
      total: _body.lockBoxCashOutList.total,
    }
  }

  public getExportHeader() {
    return this.translate.instant('lockBox.cdmReports.cashOutList')
  }

  public showExportButtons() {
    return true
  }

  /**
   * Returns search form fields definitions
   */
  public getFieldEntityPropertiesTerminal(): any[] {
    const _fieldsConfigForSearchForm: any[] = []

    _fieldsConfigForSearchForm.push({
      key: 'terminalID',
      title: 'terminalID',
      translate: 'terminalID',
      type: 'text',
      required: false,
      default: this.terminalSelected.terminalID,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      inputPattern: 'onlyDigits',
      maxlength: 15,
    })
    _fieldsConfigForSearchForm.push({
      key: 'name',
      title: 'name',
      translate: 'terminalName',
      type: 'text',
      required: false,
      default: this.terminalSelected.name,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      inputPattern: 'onlyDigits',
      maxlength: 15,
    })
    return _fieldsConfigForSearchForm
  }
}
