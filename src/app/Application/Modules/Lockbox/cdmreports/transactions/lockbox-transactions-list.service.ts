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
export class LockboxTransactionsListService extends AbstractListService {
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

    // _fieldsConfigForSearchForm.push({
    //     "key": "search",
    //     "title": "search",
    //     "translate": "search",
    //     "type": "hidden",
    //     "required": false,
    //     "default": true,
    //     "validators": [],
    //     "widget": "",
    //     "widget_container_class": "hidden",
    //     "widget_container_init_row": false,
    //     "widget_container_end_row": false,
    // });

    _fieldsConfigForSearchForm.push({
      key: 'amountFrom',
      title: 'amountFrom',
      translate: 'amountFrom',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: false,
      inputPattern: 'onlyDigits',
      maxlength: 15,
    })
    _fieldsConfigForSearchForm.push({
      key: 'amountTo',
      title: 'amountTo',
      translate: 'amountTo',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      inputPattern: 'onlyDigits',
      maxlength: 15,
    })
    _fieldsConfigForSearchForm.push({
      key: 'transactionDateFrom',
      title: 'transactionDateFrom',
      translate: 'transactionDateFrom',
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
      key: 'transactionDateTo',
      title: 'transactionDateTo',
      translate: 'transactionDateTo',
      type: 'date',
      required: true,
      default: '',
      validators: [Validators.required],
      widget: 'datepicker',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
    })
    // _fieldsConfigForSearchForm.push({
    //   key: 'timeFrom',
    //   title: 'timeFrom',
    //   translate: 'timeFrom',
    //   type: 'text',
    //   required: false,
    //   default: '',
    //   validators: [],
    //   widget: '',
    //   widget_container_class: 'col-xs-12 col-sm-3',
    //   widget_container_init_row: true,
    //   widget_container_end_row: false,
    //   placeHolder: 'HH:mm:ss',
    //   maxlength: 15,
    // })
    // _fieldsConfigForSearchForm.push({
    //   key: 'timeTo',
    //   title: 'timeTo',
    //   translate: 'timeTo',
    //   type: 'text',
    //   required: false,
    //   default: '',
    //   validators: [],
    //   widget: '',
    //   widget_container_class: 'col-xs-12 col-sm-3',
    //   widget_container_init_row: false,
    //   widget_container_end_row: false,
    //   placeHolder: 'HH:mm:ss',
    //   maxlength: 15,
    // })
    _fieldsConfigForSearchForm.push({
      key: 'userID',
      title: 'userID',
      translate: 'userId',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      maxlength: 15,
    })
    _fieldsConfigForSearchForm.push({
      key: 'userName',
      title: 'userName',
      translate: 'userName',
      type: 'text',
      required: false,
      default: '',
      validators: [],
      widget: '',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: true,
      maxlength: 15,
    })
    _fieldsConfigForSearchForm.push({
      key: 'status',
      title: 'status',
      translate: 'status',
      type: 'select',
      required: false,
      default: '',
      validators: [],
      widget: 'select',
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: true,
      select_combo_key: 'lockBoxTransactionStatus',
    })

    return _fieldsConfigForSearchForm
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
    _fieldsConfigForSearchForm.push({
      key: 'regionName',
      title: 'regionName',
      translate: 'region',
      type: 'text',
      required: false,
      default: this.terminalSelected.site.regionName,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      inputPattern: 'onlyDigits',
      maxlength: 15,
    })
    _fieldsConfigForSearchForm.push({
      key: 'cityName',
      title: 'cityName',
      translate: 'city',
      type: 'text',
      required: false,
      default: this.terminalSelected.site.cityName,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: false,
      widget_container_end_row: false,
      inputPattern: 'onlyDigits',
      maxlength: 15,
    })
    _fieldsConfigForSearchForm.push({
      key: 'location1',
      title: 'location1',
      translate: 'location1',
      type: 'text',
      required: false,
      default: this.terminalSelected.site.location1,
      validators: [],
      widget: '',
      disabled: true,
      widget_container_class: 'col-xs-12 col-sm-3',
      widget_container_init_row: true,
      widget_container_end_row: true,
      inputPattern: 'onlyDigits',
      maxlength: 15,
    })

    return _fieldsConfigForSearchForm
  }

  /**
   * Returns list fields definitions for results
   */
  public getFieldsConfigForList(): any[] {
    const _fieldsConfigForList: any[] = [
      {
        key: 'dateTransaction',
        propName: 'dateTransaction',
        propValue: (row, service, combosData) =>
          this.dateService.transform(row.dateTransaction, 'dd/MM/yyyy'), // date
        translate: 'lockbox.cdmReports.dateTransaction',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 180,
      },
      {
        key: 'timeTransaction',
        propName: 'timeTransaction',
        propValue: (row, service, combosData) => row.timeTransaction,
        translate: 'lockbox.cdmReports.timeTransaction',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'amount',
        propName: 'amount',
        propValue: (row, service, combosData) => row.amount,
        translate: 'lockbox.cdmReports.transactionAmount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'accountNumber',
        propName: 'amount',
        propValue: (row, service, combosData) => row.accountNumber,
        translate: 'lockbox.cdmReports.transactionAccount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'refNumber',
        propName: 'refNumber',
        propValue: (row, service, combosData) => row.refNumber,
        translate: 'lockbox.cdmReports.transactionRefNum',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'trxStatus',
        propName: 'trxStatus',
        propValue: (row, service, combosData) => row.trxStatus,
        translate: 'lockbox.cdmReports.transactionStatus',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'trxType',
        propName: 'trxType',
        propValue: (row, service, combosData) => row.trxType,
        translate: 'lockbox.cdmReports.transactionType',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'userID',
        propName: 'userID',
        propValue: (row, service, combosData) => row.userID,
        translate: 'lockbox.cdmReports.userId',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'userName',
        propName: 'userName',
        propValue: (row, service, combosData) => row.userName,
        translate: 'lockbox.cdmReports.userName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'civilianId',
        propName: 'civilianId',
        propValue: (row, service, combosData) => row.civilianId,
        translate: 'lockbox.cdmReports.civilianID',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'employNumber',
        propName: 'employNumber',
        propValue: (row, service, combosData) => row.employNumber,
        translate: 'lockbox.cdmReports.employeeNumber',
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

    if (!this.isEmpty(criteria.amountFrom)) {
      params['amountFrom'] = criteria.amountFrom
    }
    if (!this.isEmpty(criteria.amountTo)) {
      params['amountTo'] = criteria.amountTo
    }
    if (!this.isEmpty(criteria.transactionDateFrom)) {
      params['transactionDateFrom'] = new DateFormatPipe(
        this.injector,
        this.locale,
      ).transform(criteria.transactionDateFrom, 'yyyy-MM-dd')
    }
    if (!this.isEmpty(criteria.transactionDateTo)) {
      params['transactionDateTo'] = new DateFormatPipe(
        this.injector,
        this.locale,
      ).transform(criteria.transactionDateTo, 'yyyy-MM-dd')
    }
    // if (!this.isEmpty(criteria.timeFrom)) {
    //   params['timeFrom'] = criteria.timeFrom
    // }
    // if (!this.isEmpty(criteria.timeTo)) {
    //   params['timeTo'] = criteria.timeTo
    // }
    if (!this.isEmpty(criteria.userID)) {
      params['userID'] = criteria.userID
    }
    if (!this.isEmpty(criteria.userName)) {
      params['userName'] = criteria.userName
    }
    if (!this.isEmpty(criteria.status)) {
      params['status'] = criteria.status
    }

    params['lockBoxTerminal'] = this.terminalSelected

    return this.http.post(
      this.servicesUrl + '/lockbox/reports/transactions/list',
      params,
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
    return this.translate.instant('lockbox.cdmReports.transactionsList')
  }

  public showExportButtons() {
    return true
  }
}
