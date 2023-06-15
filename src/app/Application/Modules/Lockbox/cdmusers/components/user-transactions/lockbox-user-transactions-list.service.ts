import { ConfigResourceService } from '../../../../../../core/config/config.resource.local'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { DateFormatPipe } from '../../../../../Components/common/Pipes/date-format-pipe'
import { AbstractListService } from '../../../../Common/Services/Abstract/abstract-list.service'
import { HttpClient } from '@angular/common/http'
import { Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { DatePipe } from '@angular/common'

@Injectable()
export class LockboxUserTransactionsListService extends AbstractListService {
  combosData: any = {}
  terminalSelected: any = {}
  terminals = []

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

  /**
   * Returns search form fields definitions
   */
  public getFieldsConfigForSearchForm(): any[] {
    const _fieldsConfigForSearchForm: any[] = []
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
      maxlength: 10,
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
      widget_container_init_row: true,
      widget_container_end_row: false,
      select_combo_key: 'terminals',
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
      widget_container_end_row: false,
      maxlength: 250,
    })
    _fieldsConfigForSearchForm.push({
      key: 'civilianID',
      title: 'civilianID',
      translate: 'civilianID',
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
      widget_container_end_row: true,
      maxlength: 50,
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
        translate: 'lockbox.cdmUsers.dateTransaction',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        column_width: 180,
        append_next_column: true,
      },
      {
        key: 'timeTransaction',
        propName: 'timeTransaction',
        propValue: (row, service, combosData) => row.timeTransaction,
        translate: 'lockbox.cdmUsers.timeTransaction',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'amount',
        propName: 'amount',
        propValue: (row, service, combosData) => row.amount,
        translate: 'lockbox.cdmUsers.transactionAmount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        append_next_column: true,
      },
      {
        key: 'accountNumber',
        propName: 'amount',
        propValue: (row, service, combosData) => row.accountNumber,
        translate: 'lockbox.cdmUsers.transactionAccount',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'trxStatus',
        propName: 'trxStatus',
        propValue: (row, service, combosData) => {
          const list = combosData['lockBoxTransactionStatus']
            ? combosData['lockBoxTransactionStatus']
            : []
          let elem = null
          elem = list.find((item) => item.key == row.trxStatus)
          if (elem != null) {
            return elem.value
          }
          return row.trxStatus
        },
        translate: 'lockbox.cdmUsers.transactionStatus',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        modelKey: 'lockBoxTransactionStatus',
      },
      {
        key: 'terminalID',
        propName: 'terminalID',
        propValue: (row, service, combosData) => row.terminalID,
        translate: 'lockbox.cdmUsers.terminalID',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        append_next_column: true,
      },
      {
        key: 'terminalName',
        propName: 'terminalName',
        propValue: (row, service, combosData) => row.terminalName,
        translate: 'lockbox.cdmUsers.terminalName',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'terminalLocation1',
        propName: 'terminalLocation1',
        propValue: (row, service, combosData) => row.terminalLocation1,
        translate: 'lockbox.cdmUsers.terminalLocation1',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'civilianId',
        propName: 'civilianId',
        propValue: (row, service, combosData) => row.civilianId,
        translate: 'lockbox.cdmUsers.civilianID',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
      },
      {
        key: 'userID',
        propName: 'userID',
        propValue: (row, service, combosData) => row.userID,
        translate: 'lockbox.cdmUsers.userId',
        link_to_detail: false,
        parent_div_class: 'col-xs-6',
        export: true,
        append_next_column: true,
        column_width: 250,
      },
      {
        key: 'userName',
        propName: 'userName',
        propValue: (row, service, combosData) => row.userName,
        translate: 'lockbox.cdmUsers.userName',
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
              : 'auto',
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

    if (!this.isEmpty(criteria.civilianID)) {
      params['civilianID'] = criteria.civilianID
    }
    if (!this.isEmpty(criteria.userID)) {
      params['userID'] = criteria.userID
    }
    if (!this.isEmpty(criteria.userName)) {
      params['userName'] = criteria.userName
    }

    if (!this.isEmpty(criteria.terminalID)) {
      const _terminal = this.terminals.find(
        (terminal) => (terminal.terminalID = criteria.terminalID),
      )
      params['terminalId'] = _terminal.terminalID
    }

    return this.http.post(
      this.servicesUrl + '/lockbox/userManagement/transactions/search',
      params,
    )
  }

  protected getOutputFromRequestedData(_body) {
    const _fieldsConfigForList = this.getFieldsConfigForList()
    if (
      _body.lockBoxTransactionList.items &&
      _body.lockBoxTransactionList.items.length >= 0
    ) {
      _body.lockBoxTransactionList.items.forEach((item, index, self) => {
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
        items: _body.lockBoxTransactionList.items,
        size: _body.lockBoxTransactionList.size,
        total: _body.lockBoxTransactionList.total,
      },
      size: _body.lockBoxTransactionList.size,
      total: _body.lockBoxTransactionList.total,
    }
  }

  public getExportHeader() {
    return this.translate.instant('lockbox.cdmUsers.userTransactionsList')
  }

  public showExportButtons() {
    return true
  }

  public getTerminals(): Observable<any> {
    const params = {
      status: '1',
      page: '1',
      rows: '100',
      orderType: 'asc',
    }

    return this.http.get(this.servicesUrl + '/lockbox/terminals', { params })
  }
}
