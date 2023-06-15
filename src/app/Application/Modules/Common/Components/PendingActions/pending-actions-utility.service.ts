import { Observable, of } from 'rxjs'
import { Inject, Injectable, Injector, LOCALE_ID } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { AbstractActionAproveService } from '../../Services/Abstract/abstract-action-aprove.service'
import { PagedData } from '../../../../Model/paged-data'
import { catchError, map } from 'rxjs/operators'
import { Page } from '../../../../Model/page'
import { SelectionType } from '@swimlane/ngx-datatable'
import { DateFormatPipe } from '../../../../Components/common/Pipes/date-format-pipe'
import { FormGroup } from '@angular/forms'

@Injectable()
export abstract class PendingActionsUtilityService extends AbstractActionAproveService {
  combosData: any = null

  protected constructor(
    protected http: HttpClient,
    public config: ConfigResourceService,
    protected injector: Injector,
    @Inject(LOCALE_ID) protected locale: string,
  ) {
    super(http, config)
  }

  setCombosData(combosData: any) {
    this.combosData = combosData
  }

  getCombosData(): any {
    return this.combosData
  }

  public getResults(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<PagedData<any>> {
    return this.createDataRequest(criteria, order, orderType, page, rows).pipe(
      map((response: any) => {
        const _body = response

        if (response.errorCode != 0) {
          return null
        } else {
          const output = this.getExportableOutputFromRequestedData(_body)

          const pagedData = new PagedData<any>()
          const pageObject = new Page()

          pageObject.pageNumber = page
          pageObject.pageSize = rows
          pageObject.size = output.size
          pageObject.totalElements = output.total
          pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

          pagedData.data = output['data'] ? output['data'] : output['items']
          pagedData.page = pageObject

          return pagedData
        }
      }),
      catchError(this.handleError),
    )
  }

  protected abstract createDataRequest(
    criteria: any,
    order: string,
    orderType: string,
    page: number,
    rows: number,
  ): Observable<any>

  protected getExportableOutputFromRequestedData(_body): any {
    const output = this.getOutputFromRequestedData(_body)
    if (output.items) {
      const fixedFieldNames = this.getTableFixedFieldsNames()
      output.items.forEach((row) => {
        this.reCalculateFixedFieldValue(row)
      })
    }
    return output
  }

  public reCalculateFixedFieldValue(row: any): any {
    const fixedFieldNames = this.getTableFixedFieldsNames()
    fixedFieldNames.forEach((fieldName) => {
      row['_' + fieldName] = this.getTableFixedColumnValueByField(
        fieldName,
        row,
        this.combosData,
      )
    })
    return row
  }

  protected abstract getOutputFromRequestedData(_body): any

  protected createInitRequest(values: any): Observable<any> {
    return of({ errorCode: '0' })
  }

  protected createStepRequest(step: number, values: any): Observable<any> {
    switch (step) {
      case 1:
        return this.createValidateRequest(values)
      case 2:
        break
    }
    return of({ errorCode: '0' })
  }

  /**
   * Validate params before approve pending actions
   *
   * @param values
   */
  protected createValidateRequest(values: any): Observable<any> {
    return of({ errorCode: '0' })
  }

  /**
   * Get row data details for show information about a pending action
   *
   * @param values
   */
  protected createDetailsRequest(values: any): Observable<any> {
    return of({ errorCode: '0' })
  }

  public abstract getId(row): any

  public getCombosKeys(): any[] {
    return []
  }

  public abstract getTranslatePrefix(): string

  public abstract getFieldsConfigForSearchForm(): any[]

  public abstract getFieldsConfigForList(): any[]

  public isSelectItemsAllowed(): boolean {
    return (
      this.isDeleteAllowed() ||
      this.isApproveAllowed() ||
      this.isRefuseAllowed()
    )
  }

  public abstract isApproveAllowed(): boolean

  public abstract isRefuseAllowed(): boolean

  public isDeleteAllowed() {
    return false
  }

  public isReInitiateAllowed() {
    return false
  }

  public getInitiatorFieldName() {
    return 'initiatedBy'
  }

  public getStatusFieldName() {
    return 'status'
  }

  public canDeleteRow(row: any, currentUserId: string) {
    if (!row || !this.isDeleteAllowed()) {
      return false
    }
    if (row[this.getStatusFieldName()] !== 'RF') {
      return false
    }
    if (row[this.getInitiatorFieldName()] === currentUserId) {
      return true
    }
    return false
  }

  public canReInitiateRow(row: any, currentUserId: string) {
    if (!row || !this.isReInitiateAllowed()) {
      return false
    }
    if (row[this.getStatusFieldName()] !== 'RF') {
      return false
    }
    if (row[this.getInitiatorFieldName()] === currentUserId) {
      return true
    }
    return false
  }

  public isDisabled() {
    return false
  }

  public getTableFixedFieldsNames() {
    return [
      'type',
      'status',
      'initiatedBy',
      'initiatedDate',
      'endedBy',
      'rejectedReason',
    ]
  }

  public getTableFixedFieldsColumnWidth() {
    return {
      type: 100,
      status: 100,
      initiatedBy: 110,
      initiationDate: 120,
      initiatedDate: 120,
      endedBy: 110,
      rejectedReason: 150,
    }
  }

  public getColumnWidthByTableFixedField(fieldName) {
    const defs = this.getTableFixedFieldsColumnWidth()
    return defs && defs[fieldName] ? defs[fieldName] : null
  }

  public getTableFixedColumnNameByField(fieldName) {
    return 'pendingActions.general.' + fieldName
  }

  public getTableFixedColumnValueByField(fieldName, row, combosData) {
    switch (fieldName) {
      case 'type': {
        if (
          combosData['process'] === undefined ||
          combosData['process'] === null
        ) {
          return ''
        }
        const val = combosData['process'].find(
          (elem) => elem['key'] == row.type,
        )
        return val ? val['value'] : row.type
      }
      case 'status': {
        if (
          combosData['processStatus'] === undefined ||
          combosData['process'] === null
        ) {
          return ''
        }
        const val = combosData['processStatus'].find(
          (elem) => elem['key'] == row.status,
        )
        return val ? val['value'] : row.status
      }
      case 'initiatedBy':
        return row.initiatedBy
      case 'initiationDate':
        return row.initiationDate
          ? new DateFormatPipe(this.injector, this.locale).transform(
              row.initiationDate,
              'dd/MM/yyyy HH:mm:ss',
            )
          : ''
      case 'initiatedDate':
        return row.initiatedDate
          ? new DateFormatPipe(this.injector, this.locale).transform(
              row.initiatedDate,
              'dd/MM/yyyy HH:mm:ss',
            )
          : ''
      case 'endedBy':
        return row.endedBy
      case 'rejectedReason':
        return row.rejectedReason
      default:
        return row[fieldName]
    }
  }

  public showRejectReason() {
    return false
  }

  public showStepWizard(): boolean {
    return (
      this.isApproveAllowed() ||
      this.isRefuseAllowed() ||
      this.isDeleteAllowed() ||
      this.isReInitiateAllowed()
    )
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
            title_translate_key:
              this.getTranslatePrefix() + '.' + _fieldConfig.translate,
            dataKey: _fieldConfig.exportKey
              ? _fieldConfig.exportKey
              : _fieldConfig.key,
            transformFn: _fieldConfig.transformFn,
            modelKey: _fieldConfig.modelKey,
            dateFormat: _fieldConfig.dateFormat,
            width: _fieldConfig.export_column_width
              ? _fieldConfig.export_column_width
              : _fieldConfig.width
              ? _fieldConfig.width
              : 'auto',
          }),
        )
      }
    })
    this.getTableFixedFieldsNames().forEach((fieldName) => {
      exportColumns.push(this.getExportDefinitionForFixedColumn(fieldName))
    })
    return exportColumns
  }

  protected getExportDefinitionForFixedColumn(fieldName) {
    return {
      title_translate_key: this.getTableFixedColumnNameByField(fieldName),
      dataKey: '_' + fieldName,
      width: this.getExportColumnWidthForFixedColumn(fieldName),
    }
  }

  protected getExportColumnWidthForFixedColumn(fieldName) {
    return fieldName == 'rejectedReason' ? 150 : 'auto'
  }

  public getExportHeader() {
    return ''
  }

  public showExportButtons() {
    return true
  }

  public getPdfPageSize(): any {
    return 'A4'
  }

  public getDefaultSelectionType() {
    return SelectionType.checkbox
  }

  public validateOperation(values: any): Observable<any> {
    const items = values.items
    const models: FormGroup[] = values.models
    const modifiedItems = []
    items.forEach((item, i) => {
      if (this.isEditableOperation(values.operation)) {
        modifiedItems.push(Object.assign({}, item, models[i].getRawValue()))
      } else {
        modifiedItems.push(item)
      }
    })
    switch (values.operation) {
      case this.aproveOperation:
        return this.step(1,{
          operation: values.operation,
          items: modifiedItems,
        })
      case this.refuseOperation:
        return of({
          errorCode: '0',
          items: modifiedItems,
          generateChallengeAndOTP: null
        })
      case this.deleteOperation:
        return of({
          errorCode: '0',
          modifiedItems,
          generateChallengeAndOTP: null
        })
      case this.reInitiateOperation:
        return this.step(1, {
          operation: values.operation,
          items: modifiedItems
        })
      default:
        return of({
          errorCode: '-1',
        })
    }
  }

  public confirmOperation(values: any): Observable<any> {
    const items = values.items
    const models: FormGroup[] = values.models
    const modifiedItems = []
    items.forEach((item, i) => {
      if (this.isEditableOperation(values.operation)) {
        modifiedItems.push(Object.assign({}, item, models[i].getRawValue()))
      } else {
        modifiedItems.push(item)
      }
    })
    switch (values.operation) {
      case this.aproveOperation:
        return this.confirm({
          operation: values.operation,
          items: modifiedItems,
          validationData: values.validationData,
          requestValidate: values.requestValidate,
        })
      case this.refuseOperation:
        return this.refuse({
          operation: values.operation,
          items: modifiedItems,
          validationData: values.validationData,
          requestValidate: values.requestValidate,
          rejectedReason: values.rejectedReason,
        })
      case this.deleteOperation:
        return this.delete({
          operation: values.operation,
          items: modifiedItems,
          validationData: values.validationData,
          requestValidate: values.requestValidate,
        })
      case this.reInitiateOperation:
        return this.reInitiate({
          operation: values.operation,
          items: modifiedItems,
          validationData: values.validationData,
          requestValidate: values.requestValidate,
        })
      default:
        return of({
          errorCode: '-1',
        })
    }
  }

  public getFormConfigsForSelectedItem(itemDetails, operation) {
    const formConfigs = []
    formConfigs.push(
      ...this.getExtraFormFieldsConfigsForSelectedItem(itemDetails, operation),
    )
    formConfigs.push(
      ...this.getFixedFormFieldsConfigsForSelectedItem(itemDetails, operation),
    )
    return formConfigs
  }

  protected getExtraFormFieldsConfigsForSelectedItem(itemDetails, operation) {
    return []
  }

  protected getFixedFormFieldsConfigsForSelectedItem(itemDetails, operation) {
    const formConfigs = []
    this.getTableFixedFieldsNames().forEach((fieldName, i) => {
      formConfigs.push({
        key: '_' + fieldName,
        title: this.getTableFixedColumnNameByField(fieldName),
        translate: this.getTableFixedColumnNameByField(fieldName),
        translate_use_prefix: false,
        type: fieldName != 'rejectedReason' ? 'text' : 'textarea',
        required: false,
        readonly: true,
        default: this.getTableFixedColumnValueByField(
          fieldName,
          itemDetails,
          this.combosData,
        ),
        validators: [],
        widget: '',
        widget_container_class:
          fieldName != 'rejectedReason'
            ? 'col-xs-12 col-sm-3'
            : 'col-xs-12 col-sm-12',
        widget_container_init_row:
          i == 0 || fieldName == 'rejectedReason' ? true : false,
        widget_container_end_row: fieldName == 'rejectedReason' ? true : false,
      })
    })
    return formConfigs
  }

  isEditableOperation(operation: string): boolean {
    switch (operation) {
      case this.reInitiateOperation:
        return true
      /*
            case this.aproveOperation:
                      return false;
            case this.refuseOperation:
                return false;
            case this.deleteOperation:
                return false;
            */
      default:
        return false
    }
  }

  isPendingAction(operation: string): boolean {
    switch (operation) {
      case this.reInitiateOperation:
        return true
      /*
            case this.aproveOperation:
                      return false;
            case this.refuseOperation:
                return false;
            case this.deleteOperation:
                return false;
             */
      default:
        return false
    }
  }
}
