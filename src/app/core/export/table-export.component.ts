import {
  Component,
  DoCheck,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
} from '@angular/core'
import { DomSanitizer } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { HiddenCardNumberPipe } from 'app/Application/Components/common/Pipes/card-number-hidden'
import { CardPaymentTypePipe } from 'app/Application/Components/common/Pipes/card-payment-type'
import { PrepaidCardOperationTypePipe } from 'app/Application/Components/common/Pipes/prepaid-card-operation-type'
import { PrePaidCardPaymentService } from 'app/Application/Modules/PrePaidCard/PrePaidCardPayment/prePaidCardPayment.service'
import { saveAs } from 'file-saver'
import { SimpleMQ } from 'ng2-simple-mq'
import pdfMake from 'pdfmake/build/pdfmake'
import pdfFonts from 'pdfmake/build/vfs_fonts'
import { AsyncSubject, Observable, of, Subject } from 'rxjs'
import { map, takeUntil } from 'rxjs/operators'
import * as XLSX from 'xlsx'
import { AmountCurrencyPipe } from '../../Application/Components/common/Pipes/amount-currency.pipe'
import { DateFormatPipe } from '../../Application/Components/common/Pipes/date-format-pipe'
import { HijraDateFormatPipe } from '../../Application/Components/common/Pipes/hijra-date-format-pipe'
import { ModelPipe } from '../../Application/Components/common/Pipes/model-pipe'
import { PaymentPipe } from '../../Application/Components/common/Pipes/paymenttype-pipe'
import { StatusPipe } from '../../Application/Components/common/Pipes/status-pipe'
import { StaticService } from '../../Application/Modules/Common/Services/static.service'
import { DecimalPipe, DatePipe } from '@angular/common'
import { PDFMakeConstants } from '../config/PDFMakeConstants'

declare let jsPDF: any
pdfMake.vfs = pdfFonts.pdfMake.vfs

@Component({
  selector: 'table-export',
  templateUrl: './table-export.component.html',
  styleUrls: [],
  providers: [{ provide: 'Window', useValue: window }],
})
export class TableExportComponent implements OnInit, DoCheck, OnDestroy {
  arabicsubst = {
    1569: [65152],
    1570: [65153, 65154, 65153, 65154],
    1571: [65155, 65156, 65155, 65156],
    1572: [65157, 65158],
    1573: [65159, 65160, 65159, 65160],
    1574: [65161, 65162, 65163, 65164],
    1575: [65165, 65166, 65165, 65166],
    1576: [65167, 65168, 65169, 65170],
    1577: [65171, 65172],
    1578: [65173, 65174, 65175, 65176],
    1579: [65177, 65178, 65179, 65180],
    1580: [65181, 65182, 65183, 65184],
    1581: [65185, 65186, 65187, 65188],
    1582: [65189, 65190, 65191, 65192],
    1583: [65193, 65194, 65193, 65194],
    1584: [65195, 65196, 65195, 65196],
    1585: [65197, 65198, 65197, 65198],
    1586: [65199, 65200, 65199, 65200],
    1587: [65201, 65202, 65203, 65204],
    1588: [65205, 65206, 65207, 65208],
    1589: [65209, 65210, 65211, 65212],
    1590: [65213, 65214, 65215, 65216],
    1591: [65217, 65218, 65219, 65220],
    1592: [65221, 65222, 65223, 65224],
    1593: [65225, 65226, 65227, 65228],
    1594: [65229, 65230, 65231, 65232],
    1601: [65233, 65234, 65235, 65236],
    1602: [65237, 65238, 65239, 65240],
    1603: [65241, 65242, 65243, 65244],
    1604: [65245, 65246, 65247, 65248],
    1605: [65249, 65250, 65251, 65252],
    1606: [65253, 65254, 65255, 65256],
    1607: [65257, 65258, 65259, 65260],
    1608: [65261, 65262, 65261, 65262],
    1609: [65263, 65264, 64488, 64489],
    1610: [65265, 65266, 65267, 65268],
    1649: [64336, 64337],
    1655: [64477],
    1657: [64358, 64359, 64360, 64361],
    1658: [64350, 64351, 64352, 64353],
    1659: [64338, 64339, 64340, 64341],
    1662: [64342, 64343, 64344, 64345],
    1663: [64354, 64355, 64356, 64357],
    1664: [64346, 64347, 64348, 64349],
    1667: [64374, 64375, 64376, 64377],
    1668: [64370, 64371, 64372, 64373],
    1670: [64378, 64379, 64380, 64381],
    1671: [64382, 64383, 64384, 64385],
    1672: [64392, 64393],
    1676: [64388, 64389],
    1677: [64386, 64387],
    1678: [64390, 64391],
    1681: [64396, 64397],
    1688: [64394, 64395, 64394, 64395],
    1700: [64362, 64363, 64364, 64365],
    1702: [64366, 64367, 64368, 64369],
    1705: [64398, 64399, 64400, 64401],
    1709: [64467, 64468, 64469, 64470],
    1711: [64402, 64403, 64404, 64405],
    1713: [64410, 64411, 64412, 64413],
    1715: [64406, 64407, 64408, 64409],
    1722: [64414, 64415],
    1723: [64416, 64417, 64418, 64419],
    1726: [64426, 64427, 64428, 64429],
    1728: [64420, 64421],
    1729: [64422, 64423, 64424, 64425],
    1733: [64480, 64481],
    1734: [64473, 64474],
    1735: [64471, 64472],
    1736: [64475, 64476],
    1737: [64482, 64483],
    1739: [64478, 64479],
    1740: [64508, 64509, 64510, 64511],
    1744: [64484, 64485, 64486, 64487],
    1746: [64430, 64431],
    1747: [64432, 64433],
  }
  arabiclaasubst = {
    1570: [65269, 65270, 65269, 65270],
    1571: [65271, 65272, 65271, 65272],
    1573: [65273, 65274, 65273, 65274],
    1575: [65275, 65276, 65275, 65276],
  }

  arabicorigsubst = {
    1570: [65153, 65154, 65153, 65154],
    1571: [65155, 65156, 65155, 65156],
    1573: [65159, 65160, 65159, 65160],
    1575: [65165, 65166, 65165, 65166],
  }

  unicode_diacritics = {
    1612: 64606, // Shadda + Dammatan
    1613: 64607, // Shadda + Kasratan
    1614: 64608, // Shadda + Fatha
    1615: 64609, // Shadda + Damma
    1616: 64610, // Shadda + Kasra
  }

  alfletter = [1570, 1571, 1573, 1575]

  endedletter = [
    1569, 1570, 1571, 1572, 1573, 1575, 1577, 1583, 1584, 1585, 1586, 1608,
    1688,
  ]

  diacritics = [1612, 1613, 1614, 1615, 1616]

  base64logo = PDFMakeConstants.BASE64_LOGO

  @Input() dataTable: DatatableComponent

  @Input() header: string

  @Input() rows: any[]

  @Input() columns: any[]

  @Input() auxData: any = {}

  @Input() data: any[]

  @Input() maxAllowedRows = 0

  @Input() pdfPageSize: any = 'A4'

  rowsAsync: AsyncSubject<any>

  rowsRetieval: any = {}
  groupColumn: any
  destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(
    @Inject('Window') private window: Window,
    @Inject(LOCALE_ID) private _locale: string,
    private injector: Injector,
    private _sanitizer: DomSanitizer,
    public translate: TranslateService,
    private router: Router,
    public staticService: StaticService,
    private smq: SimpleMQ,
    private decimalPipe: DecimalPipe,
    private datePipe: DatePipe,
  ) {
    pdfMake.vfs = pdfFonts.pdfMake.vfs
  }

  ngOnInit(): void {
    new ModelPipe(this.injector).transform('currency', '608')
    //Prepare tables columns with modelPipe
    this.prepareTableColumns(this.columns)
    this.translate.onLangChange.subscribe((lang) => {
      this.prepareTableColumns(this.columns)
    })
  }

  ngOnDestroy() {
    this.destroy$.next(true)
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.unsubscribe()
  }

  ngDoCheck(): void {
    if (
      this.rowsRetieval.active &&
      this.rowsRetieval.previousRows !== this.dataTable.rows
    ) {
      if (this.rowsRetieval.finish) {
        this.rowsAsync.next(this.extractRows())
        this.rowsAsync.complete()
        this.rowsRetieval = {}
      } else {
        if (
          this.rowsRetieval.actualPage === 0 &&
          this.rowsRetieval.originalPage !== 0 &&
          this.rowsRetieval.previousRows.length === 0
        ) {
          this.dataTable.onBodyPage({ offset: this.rowsRetieval.actualPage })
        } else {
          this.calcNextPage()
        }
        this.rowsRetieval.previousRows = this.dataTable.rows
      }
    }
  }

  private arrayContainsElement(array, element): boolean {
    let iterator
    let result = false

    for (iterator = 0; iterator < array.length; iterator += 1) {
      if (array[iterator] === element) {
        result = true
      }
    }
    return result
  }

  private extractRows() {
    if (this.dataTable.groupRowsBy) {
      const rows = []
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.rowsRetieval.groupsRows.length; i++) {
        rows.push({
          [this.dataTable.groupRowsBy]: this.rowsRetieval.groupsRows[i].key,
          _groupColumn: this.rowsRetieval.groupsRows[i].value[0],
        })
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < this.rowsRetieval.groupsRows[i].value.length; j++) {
          rows.push(this.rowsRetieval.groupsRows[i].value[j])
        }
      }
      return rows
    } else {
      return this.rowsRetieval.rows
    }
  }

  private calcNextPage() {
    this.rowsRetieval.rows = this.rowsRetieval.rows.concat(this.dataTable.rows)
    this.rowsRetieval.groupsRows = this.rowsRetieval.groupsRows.concat(
      this.dataTable.groupedRows,
    )
    if (this.rowsRetieval.actualPage + 1 >= this.rowsRetieval.totalPages) {
      this.dataTable.onBodyPage({ offset: this.rowsRetieval.originalPage })
      this.rowsRetieval.finish = true
    } else {
      this.rowsRetieval.actualPage++
      this.dataTable.onBodyPage({ offset: this.rowsRetieval.actualPage })
    }
  }

  private initializeRowsRetrieval(): Observable<any> {
    const total = this.dataTable.count
    const pageSize = this.dataTable.limit
    this.rowsRetieval.totalPages = Math.ceil(total / pageSize)
    this.rowsRetieval.originalPage = this.dataTable.offset
    this.rowsRetieval.actualPage = 0
    this.rowsRetieval.rows = []
    this.rowsRetieval.groupsRows = []
    this.rowsRetieval.previousRows = []
    this.rowsRetieval.active = true
    this.rowsAsync = new AsyncSubject()
    return this.rowsAsync
  }

  private getColumns() {
    if (this.columns) {
      return this.columns
    } else if (this.dataTable) {
      const originalColumns = this.dataTable.columns
        ? this.dataTable.columns
        : this.dataTable.bodyComponent.columns
      const columns: any = []
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < originalColumns.length; i++) {
        const column = originalColumns[i]
        if (column.prop) {
          const dataKey = column.prop
          let title = column.prop
          if (column.name) {
            title = column.name
          }
          columns.push({ title, dataKey })
        }
      }
      return columns
    } else {
      return []
    }
  }

  private getRows(columns): Observable<any> {
    if (this.rows) {
      return of(this.prepareRows(columns, this.rows))
    } else if (this.dataTable) {
      const total = this.dataTable.count
      const pageSize = this.dataTable.limit

      if (total === 0 && this.dataTable.externalPaging) {
        const result = []
        let vacio = '{'

        for (let j = 0; j < columns.length; j++) {
          if (j !== 0) {
            vacio += ', '
          }
          vacio += '"' + columns[j].dataKey + '": " "'
        }
        vacio += ' }'
        result.push(JSON.parse(vacio))
        return of(result)
      } else if (!this.dataTable.externalPaging) {
        return of(this.prepareRows(columns, this.dataTable._rows))
      } else {
        this.groupColumn = this.dataTable.groupRowsBy
        this.injector.get(SimpleMQ).publish('loader-mq', true)
        return this.initializeRowsRetrieval().pipe(
          map((result) => {
            return this.prepareRows(columns, result)
          }),
        )
      }
    } else {
      return of([])
    }
  }

  private prepareRows(columns, result) {
    let lastGroup = ''
    const rows: any = []
    const originalRows = result
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < originalRows.length; i++) {
      const row = originalRows[i]
      //eliminar cabeceras de grupo por cambio de pagina
      if (this.groupColumn && row['_groupColumn']) {
        if (row[this.groupColumn] == lastGroup) {
          continue
        } else {
          lastGroup = row[this.groupColumn]
        }
      }
      const _row = {}

      // tslint:disable-next-line:prefer-for-of
      for (let j = 0; j < columns.length; j++) {
        const columnDef = columns[j]
        const actualDataKey = columnDef.dataKey
        let actualValue = row[actualDataKey]
        if (actualDataKey === this.groupColumn && !row['_groupColumn']) {
          actualValue = ''
        } else if (actualValue == null) {
          actualValue = ''
        }

        if (actualDataKey !== 'billProcess' && _row[actualDataKey] !== '') {
          if (columnDef['transformFn'] === false) {
            _row[actualDataKey] = actualValue
          } else if (columnDef['transformFn']) {
            _row[actualDataKey] = columnDef['transformFn'](
              actualValue,
              actualDataKey,
              row,
              this.injector,
              this._locale,
            )
          } else if (columnDef['modelKey']) {
            if (actualValue != '' && actualValue != null) {
              _row[actualDataKey] = new ModelPipe(this.injector).transform(
                columnDef['modelKey'],
                actualValue,
              )
            } else {
              _row[actualDataKey] = actualValue
            }
          } else if (columnDef['useTranslation']) {
            _row[actualDataKey] =
              actualValue && actualValue != ''
                ? this.translate.instant(actualValue)
                : actualValue
          } else {
            _row[actualDataKey] = this.transformCellValue(
              row,
              actualDataKey,
              actualValue,
              columnDef,
            )
          }
        } else {
          _row[actualDataKey] = ''
        }
      }

      rows.push(_row)
    }
    this.injector.get(SimpleMQ).publish('loader-mq', false)
    return rows
  }

  private transformCellValue(row, key, value, columnDef): string {
    if (value == null) {
      value = ''
    }
    if (key) {
      if (this.auxData[key]) {
        value = this.auxData[key][value]
      } else if (key === 'branchRbs5') {
        //console.log(key);

        value = new ModelPipe(this.injector).transform('branchRbs5', value)
        for (const data of value) {
          if (data.key == row.branchid) {
            value = data.value
          }
        }
      }
        // else if (key === "status") {
        //   value = new ModelPipe(this.injector).transform(
        //     "status",
        //     value
        //   );
        //
        //   if(value.length == 0){
        //       value = '-'
        //   }else{
        //       value = value;
        //   }
      // }
      else if (key === 'dateGroup') {
        if (value) {
          value = new DateFormatPipe(this.injector).transform(
            row['_groupColumn']['date'],
            'fullDate',
          )
          value +=
            ' - ' +
            new HijraDateFormatPipe(this.injector).transform(
              row['_groupColumn']['hijraDate'],
              'fullDate',
            )
        }
      } else if (key === 'lastPaymentDate' || key === 'nextPaymentDate') {
        if (
          value &&
          value.constructor.name == 'String' &&
          value.indexOf('/') === -1
        ) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat'] ? columnDef['dateFormat'] : 'dd/MM/yyyy',
          )
        }
      } else if (
        key.indexOf('paymentDateG') !== -1 ||
        key.indexOf('paymentDateH') !== -1
      ) {
        if (
          value &&
          value.constructor.name == 'String' &&
          value.indexOf('/') === -1
        ) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat'] ? columnDef['dateFormat'] : 'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('paymentDate') !== -1) {
        if (
          value &&
          value.constructor.name == 'String' &&
          value.indexOf('/') === -1
        ) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat'] ? columnDef['dateFormat'] : 'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('initiationDate') !== -1) {
        if (
          value &&
          value.constructor.name == 'String' &&
          value.indexOf('/') === -1
        ) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat']
              ? columnDef['dateFormat']
              : 'dd/MM/yyyy HH:mm:ss',
          )
        }
      } else if (key.indexOf('initiatedDate') !== -1) {
        if (
          value &&
          value.constructor.name == 'String' &&
          value.indexOf('/') === -1
        ) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat']
              ? columnDef['dateFormat']
              : 'dd/MM/yyyy HH:mm:ss',
          )
        }
      } else if (key.indexOf('requestDate') !== -1) {
        if (
          value &&
          value.constructor.name == 'String' &&
          value.indexOf('/') === -1
        ) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat'] ? columnDef['dateFormat'] : 'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('Date') !== -1 || columnDef['dateFormat'] || key.indexOf('Period') !== -1) {
        if (
          value &&
          value.constructor.name == 'String' &&
          value.indexOf('/') === -1
        ) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat'] ? columnDef['dateFormat'] : 'dd/MM/yyyy',
          )
        }
      } else if (key.indexOf('ijri') !== -1) {
        if (value) {
          value = new DateFormatPipe(this.injector, this._locale).transform(
            value,
            columnDef['dateFormat'] ? columnDef['dateFormat'] : 'short',
          )
        }
      } else if (key.indexOf('mount') !== -1 && key !== 'amountCurrencyItem') {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (key === 'averageNumber') {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (key === 'exchangeRate') {
        value =
          value !== ''
            ? this.decimalPipe.transform(row.exchangeRate, '1.4-6')
            : value
      } else if (key.indexOf('alance') !== -1) {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (
        key === 'debit' ||
        key === 'credit' ||
        key === 'salary' ||
        key === 'salaryBasic' ||
        key === 'allowanceHousing' ||
        key === 'allowanceOther' ||
        key === 'deductions'
      ) {
        value =
          value !== ''
            ? new AmountCurrencyPipe(this.injector, this._locale).transform(
              value,
              null,
            )
            : value
      } else if (key === 'errorCode' || key === 'returnCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'errors',
            'errorTable.' + value,
          )
        }
      } else if (key === 'paymentPurpose') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollPaymentPurpose',
            value,
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'bulkFilePurpose',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'currency') {
        if (value) {
          value = new ModelPipe(this.injector).transform('currencyIso', value)
        }
      } else if (key === 'currencyCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform('currency', value)
        }
      } else if (key === 'channelType') {
        if (value) {
          value = new ModelPipe(this.injector).transform('channelType', value)
        }
      } else if (key === 'txCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform('filterType', value)
        }
      } else if (key === 'batchType') {
        if (value) {
          value = new ModelPipe(this.injector).transform('batchTypes', value)
        }
      } else if (
        key === 'bankCodePayroll' ||
        key === 'bankDirect' ||
        key === 'payerBankCode'
      ) {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollBankCode',
            value,
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'bankCode',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'bankCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform('bankType', value)
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'bankCode',
            value.replace('???.', ''),
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'payrollBankCode',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'bankName') {
        //fix beneficiary list
        if (value) {
          value = value.replace(/\0/g, '')
        }
        if (value) {
          value = new ModelPipe(this.injector).transform('bankCode', value)
        }
        if (value) {
          value = value.replace('???.', '')
        }
      } else if (key.indexOf('country') !== -1) {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'backEndCountryCode',
            value,
          )
        }
        if (value.indexOf('???.') !== -1) {
          value = new ModelPipe(this.injector).transform(
            'countryName',
            value.replace('???.', ''),
          )
        }
      } else if (key === 'beneficiaryData.beneficiaryFullName') {
        value = row['beneficiaryData']['beneficiaryFullName']
      } else if (key === 'status') {
        if (value && row['billRef']) {
          value = new ModelPipe(this.injector).transform('billStatus', value)
        } else if (
          value &&
          this.auxData['status'] == 'batchSecurityLevelStatus'
        ) {
          value = new ModelPipe(this.injector).transform(
            'batchSecurityLevelStatus',
            value,
          )
        } else if (value && row['cardHolderName']) {
          value = new ModelPipe(this.injector).transform(
            'positivePayStatus',
            value,
          )
        } else if (value.indexOf('???.') != -1) {
          value = new StatusPipe(this.injector).transform(
            value.replace('???.', ''),
          )
        } else {
          value = new StatusPipe(this.injector).transform(value)
        }
      } else if (key === 'transferType') {
        if (value) {
          value = new PaymentPipe(this.injector).transform('5')
        }
      } else if (key === 'beneficiaryName&Account') {
        if (
          row.transferType != '5' ||
          (row.beneficiaryAccount && row.beneficiaryAccount != '')
        ) {
          value = row.beneficiaryName + '\n' + row.beneficiaryAccount
        } else {
          value = row.proxyValue
        }
      } else if (key === 'beneficiaryBankCode') {
        let country = ''
        if (row.country) {
          country = new ModelPipe(this.injector).transform(
            'backEndCountryCode',
            row.country,
          )
          value = row.beneficiaryBank + '\n' + country
        } else {
          value = row.beneficiaryBank
        }
      } else if (key === 'debitAccount&AccountNickname') {
        value = row.accountFrom.fullAccountNumber + '\n' + row.accountFrom.alias
      } else if (key === 'accountFrom.fullAccountNumber') {
        value = row.accountFrom.fullAccountNumber
      } else if (key === 'accountFrom.alias') {
        value = row.accountFrom.alias
      } else if (key === 'debit&transfer') {
        let debitAmout = new AmountCurrencyPipe(
          this.injector,
          this._locale,
        ).transform(row.sarAmount, null)
        let transferAmount = new AmountCurrencyPipe(
          this.injector,
          this._locale,
        ).transform(row.amount, null)
        let debitCurrrancy = new ModelPipe(this.injector).transform(
          'currency',
          '608',
        )
        let transferCurrrancy = new ModelPipe(this.injector).transform(
          'currency',
          row.currency,
        )
        value =
          debitAmout +
          ' ' +
          debitCurrrancy +
          '\n' +
          transferAmount +
          ' ' +
          transferCurrrancy
      } else if (key === 'isSAR') {
        let transferAmount = new AmountCurrencyPipe(
          this.injector,
          this._locale,
        ).transform(row.amount, null)
        let transferCurrrancy = new ModelPipe(this.injector).transform(
          'currency',
          '608',
        )
        value =
          transferAmount +
          ' ' +
          transferCurrrancy
      } else if (key === 'isTransfer') {
        let transferAmount = new AmountCurrencyPipe(
          this.injector,
          this._locale,
        ).transform(row.amount, null)
        let transferCurrrancy = new ModelPipe(this.injector).transform(
          'currency',
          row.currency,
        )
        value =
          transferAmount +
          ' ' +
          transferCurrrancy
      } else if (key === 'fees&exchangeRate') {
        let feesAmount = new AmountCurrencyPipe(
          this.injector,
          this._locale,
        ).transform(row.feesAmount, null)
        let exchangeRate = this.decimalPipe.transform(row.exchangeRate, '1.4-6')
        let feesCurrrancy = new ModelPipe(this.injector).transform(
          'currency',
          row.feesCurrency,
        )
        value = feesAmount + ' ' + feesCurrrancy + '\n' + exchangeRate
      } else if (key === 'feesAmount') {
        let feesAmount = new AmountCurrencyPipe(
          this.injector,
          this._locale,
        ).transform(row.feesAmount, null)
        let feesCurrrancy = new ModelPipe(this.injector).transform(
          'currency',
          row.feesCurrency,
        )
        value = feesAmount + ' ' + feesCurrrancy
      } else if (key === 'beStatus') {
        let beStatus = ''
        if (row.beStatus) {
          beStatus = new ModelPipe(this.injector).transform(
            'errors',
            'errorTable.' + row.beStatus,
          )
        } else {
          beStatus = new ModelPipe(this.injector).transform(
            'errors',
            'errorTable.' + 'E000',
          )
        }
        value = beStatus
      } else if (key === 'statusProcessedTransaction') {
        let beStatus = ''
        if (row.beStatus) {
          beStatus = new ModelPipe(this.injector).transform(
            'errors',
            'errorTable.' + row.beStatus,
          )
        } else {
          beStatus = this.injector.get(TranslateService).instant('invoiceHUB.sentTobank');
        }
        value = beStatus
      } else if (key === 'initiation') {
        value =
          row.initiatedBy +
          '\n' +
          this.datePipe.transform(row.initiationDate, 'dd-MM-yyyy')
      } else if (key === 'approval') {
        value =
          row.approvedBy +
          '\n' +
          this.datePipe.transform(row.approvedDate, 'dd-MM-yyyy')
      } else if (key === 'statusIncentive') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'incentiveCardsStatus',
            value,
          )
        }
      } else if (key === 'notificationType') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'sadadOLPNotificationsActionType',
            value,
          )
        }
      } else if (key === 'refIdType') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'sadadOLPNotificationsReferenceType',
            value,
          )
        }
      } else if (key === 'beneficiaryType') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'beneficiaryType',
            value,
          )
        }
      } else if (key === 'operationCode' || key === 'operation') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollcardsOperations',
            value,
          )
        }
      } else if (key === 'operationLog') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'activityOperationLog',
            value,
          )
        }
      } else if (key === 'region') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'terminalRegion',
            value,
          )
        }
      } else if (key === 'serviceType') {
        value = new ModelPipe(this.injector).transform('eGovSadadType', value)
      } else if (key === 'category' || key === 'beneficiaryCategory') {
        if (value == 'I') {
          value = this.injector
            .get(TranslateService)
            .instant('beneficiaries.selectIndividual')
        } else if (value == 'C') {
          value = this.injector
            .get(TranslateService)
            .instant('beneficiaries.selectCompany')
        } else {
          value = value
        }
      } else if (key === 'fees') {
        if (value.length) {
          let fees = ''
          for (let i = 0; value.length > i; i++) {
            fees =
              fees +
              (i == 0 ? '' : '\n ') +
              (value[i].feeAmount !== ''
                ? new AmountCurrencyPipe(this.injector, this._locale).transform(
                  value[i].feeAmount,
                  null,
                )
                : value[i].feeAmount)
          }
          value = fees
        } else {
          value = value
        }
      } else if (key === 'paymentOption') {
        if (value) {
          value = new CardPaymentTypePipe(this.injector).transform(value)
        }
      } else if (key === 'process') {
        if (value) {
          value = new ModelPipe(this.injector).transform('billProcess', value)
        }
      } else if (key === 'billerName') {
        if (this.translate.currentLang == 'ar') {
          value = row['addDescriptionAr']
          if (value == undefined || value == null) {
            value = row['billerName']
          }
        } else {
          value = row['addDescriptionEn']
          if (value == undefined || value == null) {
            value = row['billerName']
          }
        }
      } else if (key == 'privilege') {
        value = value ? 'X' : ''
      } else if (key === 'posRequestType') {
        value = new ModelPipe(this.injector).transform('posRequestType', value)
      } else if (key === 'posManagementRequestType') {
        value = new ModelPipe(this.injector).transform(
          'posManagementRequestType',
          value,
        )
      } else if (key === 'posMaintenanceRequestType') {
        value = new ModelPipe(this.injector).transform(
          'posMaintenanceRequestType',
          value,
        )
      } else if (key === 'posCRMStatusType') {
        value = new ModelPipe(this.injector).transform(
          'posCRMStatusType',
          value,
        )
      } else if (key === 'reasonCode') {
        if (value) {
          value = new ModelPipe(this.injector).transform(
            'payrollCardsReasonCodes',
            value,
          )
        }
      } else if (key === 'reasonCode') {
        if (
          value &&
          (value == 'over' || value == 'partial' || value == 'advanced')
        ) {
          value = new ModelPipe(this.injector).transform(
            'billPaymentType',
            value,
          )
        } else {
          const valueNew: any = 'payment'
          value = new ModelPipe(this.injector).transform(
            'billPaymentType',
            valueNew,
          )
        }
      } else if (key === 'rejectReasonText') {
        value = new ModelPipe(this.injector).transform(
          'claimFeedbackErrorCodes',
          value.trim(),
        )
      } else if (key === 'currencyIso') {
        value = new ModelPipe(this.injector).transform('currencyIso', value)
        for (const data of value) {
          if (data.key == row.currency) {
            value = data.value
          }
        }
      } else if (key === 'city') {
        value = new ModelPipe(this.injector).transform('cityType', value)
      } else if (key === 'cardAccountNumber') {
        value = new HiddenCardNumberPipe().transform(value, '7to12')
      } else if (key === 'typeOperation') {
        if (
          value === PrePaidCardPaymentService.LOAD_FUNDS_TYPE ||
          value === PrePaidCardPaymentService.REFUND_FUNDS_TYPE
        ) {
          value = new PrepaidCardOperationTypePipe(this.injector).transform(
            value,
          )
        }
      } else if (key === 'transactionStatus') {
        if(!value){
          value = this.injector.get(TranslateService).instant('governmentRevenue.processed_operations.sentTobank')
        } else {
          value = new ModelPipe(this.injector).transform('govRevenueTransactionStatus', value)
        }
      }
    }
    return value
  }

  splitIn(text, num) {
    let split = text.split(' ')
    while (split.length > num) {
      split = this.joinMinorLength(split)
    }
    return split
  }

  joinMinorLength(text): string[] {
    const lengthString = []
    const sum = []
    const newSplit = []
    let minIndex = 0
    let minLength = 1000
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < text.length; i++) {
      lengthString.push(text[i].length)
    }
    for (let i = 0; i < lengthString.length - 1; i++) {
      sum.push(lengthString[i].length + lengthString[i + 1].length)
    }
    for (let i = 0; i < sum.length; i++) {
      if (minLength > sum[i]) {
        minLength = sum[i]
        minIndex = i
      }
    }

    for (let i = 0; i < text.length; i++) {
      if (i == minIndex) {
        newSplit.push(text[i] + ' ' + text[i + 1])
        i++
      } else {
        newSplit.push(text[i])
      }
    }

    return newSplit
  }

  getMinLength(text) {
    let indice = 0
    let maxLength = text[indice].length
    for (let i = 1; i < text.length; i++) {
      if (text[i].length < maxLength) {
        maxLength = text[i].length
        indice = i
      }
    }
    return indice
  }

  private s2ab(s) {
    const buf = new ArrayBuffer(s.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i !== s.length; ++i) {
      // tslint:disable-next-line:no-bitwise
      view[i] = s.charCodeAt(i) & 0xff
    }
    return buf
  }

  private prepareTableColumns(columns) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.length; i++) {
      const key = columns[i]['dataKey']
      try {
        if (columns[i]['transformFn'] === false) {
        } else if (columns[i]['transformFn']) {
          columns[i]['transformFn'](
            null,
            columns[i]['dataKey'],
            {},
            this.injector,
            this._locale,
          )
        } else if (columns[i]['modelKey']) {
          new ModelPipe(this.injector).transform(columns[i]['modelKey'], null)
        } else if (key.indexOf('mount') !== -1) {
          new AmountCurrencyPipe(this.injector, this._locale).transform(
            null,
            null,
          )
        } else if (key === 'averageNumber') {
          new AmountCurrencyPipe(this.injector, this._locale).transform(
            null,
            null,
          )
        } else if (key.indexOf('alance') !== -1) {
          new AmountCurrencyPipe(this.injector, this._locale).transform(
            null,
            null,
          )
        } else if (
          key === 'debit' ||
          key === 'credit' ||
          key === 'salary' ||
          key === 'salaryBasic' ||
          key === 'allowanceHousing' ||
          key === 'allowanceOther' ||
          key === 'deductions'
        ) {
          new AmountCurrencyPipe(this.injector, this._locale).transform(
            null,
            null,
          )
        } else if (key === 'errorCode' || key === 'returnCode') {
          new ModelPipe(this.injector).transform('errors', 'errorTable.999')
        } else if (key === 'paymentPurpose') {
          new ModelPipe(this.injector).transform('payrollPaymentPurpose', null)
          new ModelPipe(this.injector).transform('bulkFilePurpose', null)
        } else if (key === 'currency') {
          new ModelPipe(this.injector).transform('currencyIso', null)
        } else if (key === 'currencyCode') {
          new ModelPipe(this.injector).transform('currency', null)
        } else if (key === 'channelType') {
          new ModelPipe(this.injector).transform('channelType', null)
        } else if (key === 'txCode') {
          new ModelPipe(this.injector).transform('filterType', null)
        } else if (key === 'batchType') {
          new ModelPipe(this.injector).transform('batchTypes', null)
        } else if (
          key === 'bankCodePayroll' ||
          key === 'bankDirect' ||
          key === 'payerBankCode'
        ) {
          new ModelPipe(this.injector).transform('payrollBankCode', null)
          new ModelPipe(this.injector).transform('bankCode', null)
        } else if (key === 'bankCode') {
          new ModelPipe(this.injector).transform('bankType', null)
          new ModelPipe(this.injector).transform('bankCode', null)
          new ModelPipe(this.injector).transform('payrollBankCode', null)
        } else if (key === 'bankName') {
          new ModelPipe(this.injector).transform('bankCode', null)
        } else if (key.indexOf('country') !== -1) {
          new ModelPipe(this.injector).transform('backEndCountryCode', null)
          new ModelPipe(this.injector).transform('countryName', null)
        } else if (key === 'status') {
          new ModelPipe(this.injector).transform('billStatus', null)
          new ModelPipe(this.injector).transform(
            'batchSecurityLevelStatus',
            null,
          )
          new ModelPipe(this.injector).transform('positivePayStatus', null)
          new StatusPipe(this.injector).transform(null)
        } else if (key === 'transferType') {
          new PaymentPipe(this.injector).transform(null)
        } else if (key === 'statusIncentive') {
          new ModelPipe(this.injector).transform('incentiveCardsStatus', null)
        } else if (key === 'notificationType') {
          new ModelPipe(this.injector).transform(
            'sadadOLPNotificationsActionType',
            null,
          )
        } else if (key === 'refIdType') {
          new ModelPipe(this.injector).transform(
            'sadadOLPNotificationsReferenceType',
            null,
          )
        } else if (key === 'beneficiaryType') {
          new ModelPipe(this.injector).transform('beneficiaryType', null)
        } else if (key === 'operationCode' || key === 'operation') {
          new ModelPipe(this.injector).transform('payrollcardsOperations', null)
        } else if (key === 'operationLog') {
          new ModelPipe(this.injector).transform('activityOperationLog', null)
        } else if (key === 'region') {
          new ModelPipe(this.injector).transform('terminalRegion', null)
        } else if (key === 'serviceType') {
          new ModelPipe(this.injector).transform('eGovSadadType', null)
        } else if (key === 'fees') {
          new AmountCurrencyPipe(this.injector, this._locale).transform(0, null)
        } else if (key === 'process') {
          new ModelPipe(this.injector).transform('billProcess', null)
        } else if (key === 'posRequestType') {
          new ModelPipe(this.injector).transform('posRequestType', null)
        } else if (key === 'posManagementRequestType') {
          new ModelPipe(this.injector).transform(
            'posManagementRequestType',
            null,
          )
        } else if (key === 'posMaintenanceRequestType') {
          new ModelPipe(this.injector).transform(
            'posMaintenanceRequestType',
            null,
          )
        } else if (key === 'posCRMStatusType') {
          new ModelPipe(this.injector).transform('posCRMStatusType', null)
        } else if (key === 'reasonCode') {
          new ModelPipe(this.injector).transform(
            'payrollCardsReasonCodes',
            null,
          )
        } else if (key === 'reasonCode') {
          new ModelPipe(this.injector).transform('billPaymentType', null)
        } else if (key === 'rejectReasonText') {
          new ModelPipe(this.injector).transform(
            'claimFeedbackErrorCodes',
            null,
          )
        } else if (key === 'currencyIso') {
          new ModelPipe(this.injector).transform('currencyIso', null)
        } else if (key === 'city') {
          new ModelPipe(this.injector).transform('cityType', null)
        }
      } catch (ex) {
      }
    }
  }

  private getTableColumnsWidths(columns) {
    const widths = []
    let customWidth = columns.length <= 6
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.length; i++) {
      if (columns[i]['width']) {
        customWidth = true
      }
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.length; i++) {
      if (columns[i]['width']) {
        widths.push(columns[i]['width'])
      } else {
        widths.push(customWidth ? '*' : 'auto')
      }
    }
    return widths
  }

  private getTable(talign, columns, rows) {
    const result = []
    let rowData = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < columns.length; i++) {
      let title = ''
      if (this.isArabic(columns[i]['title'])) {
        const rtitle = columns[i]['title'].split(' ')
        for (let l = rtitle.length - 1; l >= 0; l--) {
          title += rtitle[l] + ' '
        }
      } else {
        title = columns[i]['title']
      }
      rowData.push({
        text: title,
        width: '100', // 'auto', 100, '20%',
        color: [256, 256, 256],
        fillColor: [34, 26, 251],
        alignment: talign,
      })
    }
    if (talign === 'right') {
      rowData.reverse()
    }
    result.push(rowData)

    // tslint:disable-next-line:prefer-for-of
    for (let j = 0; j < rows.length; j++) {
      rowData = []
      let nomore = false
      // tslint:disable-next-line:prefer-for-of
      for (let k = 0; k < columns.length; k++) {
        //186 192  217
        let cellValue = ''
        if (this.isArabic(rows[j][columns[k]['dataKey']])) {
          const rowR = rows[j][columns[k]['dataKey']].split(' ')
          for (let l = rowR.length - 1; l >= 0; l--) {
            cellValue += rowR[l] + ' '
          }
        } else {
          cellValue = rows[j][columns[k]['dataKey']]
        }
        if (this.groupColumn !== undefined) {
          if (columns[k]['dataKey'] === this.groupColumn) {
            if (rows[j][columns[k]['dataKey']] === '') {
              rowData.push({ text: '', alignment: talign })
            } else {
              nomore = true
              rowData.push({
                text: this.getUnescapedStr(cellValue),
                style: 'bold',
                colSpan: columns.length,
                alignment: talign,
              })
            }
          } else {
            if (!nomore) {
              rowData.push({
                text: this.getUnescapedStr(cellValue),
                alignment: talign,
              })
            }
          }
        } else {
          rowData.push({
            text: this.getUnescapedStr(cellValue),
            alignment: talign,
          })
        }
      }
      if (talign === 'right') {
        rowData.reverse()
      }
      result.push(rowData)
    }

    return result
  }

  private generatePdf2(columns, rows) {
    pdfMake.vfs = {
      'Cairo.ttf':PDFMakeConstants.PDF_MAKE_VFS_EN,
    }
    pdfMake.fonts = {
      Cairo: {
        normal: 'Cairo.ttf',
        bold: 'Cairo.ttf',
      },
    }

    const date = new DateFormatPipe(this.injector, this._locale).transform(
      new Date(),
      PDFMakeConstants.PDF_MAKE_DATE_Formate,
    )
    let vheaders = [
      { text: this.header, margin: [100, 10, 10, 10], alignment: 'center' },
      { text: date, margin: [10, 10, 35, 10], alignment: 'right' },
    ]
    let vbackground = {
      image: this.base64logo,
      width: '100',
      margin: [40, -0.1, 10, 10],
    }
    if (this.isArabic(this.header)) {
      let lHeader = ''
      const rHeader = this.header.split(' ')
      for (let i = rHeader.length - 1; i >= 0; i--) {
        lHeader += rHeader[i] + ' '
      }
      vheaders = [
        { text: date, margin: [35, 10, 10, 10], alignment: 'left' },
        { text: lHeader, margin: [10, 10, 100, 10], alignment: 'center' },
      ]
      vbackground = {
        image: this.base64logo,
        width: '100',
        margin: [700, -0.1, 10, 10],
      }
    }
    let pgCnt = 0

    //--------------------------
    let tAlignment = 'left'
    let tAlignmentR = 'right'
    if (this.isArabicDocument()) {
      tAlignment = 'right'
      tAlignmentR = 'left'
    }
    //--------------------------
    const widthValues = this.getTableColumnsWidths(columns)
    if (tAlignment === 'right') {
      widthValues.reverse()
    }
    let obj=  {}

    if(this.data){
      obj =  this.getData()
    }
    const dd = {
      info: {
        title: this.header,
        author: 'eSME',
        subject: this.header,
        keywords: this.header,
      },
      pageSize: this.pdfPageSize ? this.pdfPageSize : 'A4', // 'A4'
      pageOrientation: 'landscape', //  'portrait'
      defaultStyle: {
        font: 'Cairo',
        align: 'right',
        fontSize: 8, //pdffont
      },
      background: vbackground,
      header: {
        columns: vheaders,
        margin: [10, 10, 10, 20],
      },
      footer(pageCount) {
        pgCnt++
        return {
          columns: [
            { text: pgCnt, alignment: tAlignmentR, margin: [10, 10, 10, 10] },
          ],
        }
      },
      styles: {
        header: {
          fontSize: 14,
          bold: true,
        },
        bold: {
          fontSize: 10,
          bold: true,
        },
      },
      content: [
       obj,
        {
          layout: {
            defaultBorder: false,
            fillColor(i, node) {
              return i % 2 === 0 ? [144, 153, 160] : null
            },
          },

          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: widthValues,
            body: this.getTable(tAlignment, columns, rows),
          },
          /*columns: [
                        {
                            width: "auto",
                            text: ""
                        },
                        {
                            width: "auto",
                            table: {
                                headerRows: 1,
                                widths: this.getTableColumnsWidths(columns),
                                body: this.getTable(tAlignment, columns, rows)
                            },
                            layout: {
                                defaultBorder: false,
                                fillColor(i, node) {
                                    return i % 2 === 0 ? [144, 153, 160] : null;
                                }
                            }
                        }
                    ]*/
        },
      ],
    }

    return pdfMake.createPdf(dd)
  }

  getData(){
    const allObjects=[]
    let columnsdata=[]
    if(this.isArabicDocument()){
      for (let index = 0;  index< this.data.length; index++) {
        columnsdata.push({text: this.data[index].dataKey+' :'+this.data[index].title})
        if(index%2===0){
          let obj={columns:columnsdata}
          allObjects.push(obj)
          columnsdata=[]
        }
      }
    }else{
      for (let index = 0;  index< this.data.length; index++) {
        columnsdata.push({text:this.data[index].title +': '+this.data[index].dataKey})
        if(index%2===0){
          let obj={columns:columnsdata}
          allObjects.push(obj)
          columnsdata=[]
        }
      }
    }
    return allObjects
  }

  getPdf() {
    const rowCount = this.dataTable.count
    if (
      rowCount > 0 &&
      this.maxAllowedRows > 0 &&
      rowCount > this.maxAllowedRows
    ) {
      this.showRowLimitPopup()
      return
    }

    const columns = this.getColumns()
    this.getRows(columns)
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        const doc = this.generatePdf2(columns, rows)
        if (this.header) {
          doc.download(this.header + '.pdf')
        } else {
          doc.download('report.pdf')
        }
      })
  }

  printPdf() {
    const rowCount = this.dataTable.count
    if (
      rowCount > 0 &&
      this.maxAllowedRows > 0 &&
      rowCount > this.maxAllowedRows
    ) {
      this.showRowLimitPopup()
      return
    }

    const columns = this.getColumns()

    this.getRows(columns)
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        const doc = this.generatePdf2(columns, rows).getBlob(
          (blob) => {
            const urlBlob = URL.createObjectURL(blob)
            const url = window.location.href
            const docURL =
              url.replace('#' + this.router.url, '') +
              'viewer/viewer.html?file=' +
              urlBlob
            window.open(docURL)
          },
          { autoPrint: true },
        )
      })
  }

  getXlsx() {
    const rowCount = this.dataTable.count
    if (
      rowCount > 0 &&
      this.maxAllowedRows > 0 &&
      rowCount > this.maxAllowedRows
    ) {
      this.showRowLimitPopup()
      return
    }

    const columns = this.getColumns()
    this.getRows(columns)
      .pipe(takeUntil(this.destroy$))
      .subscribe((rows) => {
        let name = 'report'
        if (this.header) {
          name = this.header
        }
        const wb: XLSX.WorkBook = XLSX.utils.book_new()

        let ws: XLSX.WorkSheet
        if(this.data){
          ws = XLSX.utils.json_to_sheet(this.data,{skipHeader:true})
          XLSX.utils.sheet_add_json(ws, rows, { skipHeader: false, origin: "A" + (this.data.length + 2) });
          this.changeHeaderTitle(ws, columns, this.data.length + 2)
        }else{
          ws= XLSX.utils.json_to_sheet(rows)
          this.changeHeaderTitle(ws, columns, 1)
        }

        XLSX.utils.book_append_sheet(wb, ws, name.substring(0, 30))
        const opts: XLSX.WritingOptions = { bookType: 'biff8', type: 'binary' }

        const wbout = XLSX.write(wb, opts)
        saveAs(
          new Blob([this.s2ab(wbout)], { type: 'application/vnd.ms-excel' }),
          name + '.xls',
        )
      })
  }

  changeHeaderTitle(ws: any, columns: any, index: any) {
    let colLetter = 'A'
    for (const col of columns) {
      ws[colLetter + index].v = col['title']
      ws[colLetter + index].s = {
        fill: {
          fgColor: {
            rgb: 'FF1E46A0',
          },
        },
        font: {
          color: {
            rgb: 'FFFFFFFF',
          },
        },
      }
      colLetter = this.getNextLetter(colLetter)
    }
  }

  getNextLetter(char: string): string {
    let code: number = char.charCodeAt(0)
    code++
    return String.fromCharCode(code)
  }

  getCorrectForm(currentChar, beforeChar, nextChar, arabicSubstition): number {
    const isolatedForm = 0
    const finalForm = 1
    const initialForm = 2
    const middleForm = 3
    arabicSubstition = arabicSubstition || {}
    const _arabicSubst = Object.assign(this.arabicsubst, arabicSubstition)
    if (_arabicSubst[currentChar.charCodeAt(0)] === undefined) {
      return -1
    }

    //current arabic letter has only isolated form
    if (_arabicSubst[currentChar.charCodeAt(0)][finalForm] === undefined) {
      return isolatedForm
    }

    if (
      //current arabic letter has only final form
      _arabicSubst[currentChar.charCodeAt(0)][initialForm] === undefined ||
      ((nextChar === undefined ||
          _arabicSubst[nextChar.charCodeAt(0)] === undefined) &&
        beforeChar !== undefined &&
        _arabicSubst[beforeChar.charCodeAt(0)] !== undefined &&
        _arabicSubst[beforeChar.charCodeAt(0)][initialForm] !== undefined)
    ) {
      return finalForm
    }

    if (
      (beforeChar !== undefined && //beforeChar is given
        _arabicSubst[beforeChar.charCodeAt(0)] !== undefined && //beforeChar is arabic
        _arabicSubst[beforeChar.charCodeAt(0)][initialForm] === undefined) || //beforeChar has no initialForm
      beforeChar === undefined ||
      _arabicSubst[beforeChar.charCodeAt(0)] === undefined ||
      this.arrayContainsElement(this.endedletter, beforeChar.charCodeAt(0))
    ) {
      return initialForm
    }
    return middleForm
  }

  isArabicDocument() {
    return this.translate.currentLang == 'ar'
  }

  isArabic(text): boolean {
    if (text === null || text === undefined) {
      return false;
    }
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < text.length; i += 1) {
      if (this.isArabicLetter(text[i])) {
        return true
      }
    }
    return false
  }

  isArabicLetter(letter): boolean {
    return (
      typeof letter === 'string' &&
      letter !== undefined &&
      this.arabicsubst[letter.charCodeAt(0)] !== undefined
    )
  }

  processArabic(text): string {
    text = text || ''
    text = text
    let result = ''
    let i = 0
    let currentLetter = ''
    let prevLetter = ''
    let nextLetter = ''
    if (!this.isArabic(text)) {
      return text
    }

    for (i = 0; i < text.length; i += 1) {
      currentLetter = text[i]
      prevLetter = text[i - 1]
      nextLetter = text[i + 1]
      let resultingLetter
      if (!this.isArabicLetter(currentLetter)) {
        result += currentLetter
      } else {
        if (
          prevLetter !== undefined &&
          prevLetter.charCodeAt(0) == 1604 &&
          this.arrayContainsElement(this.alfletter, currentLetter.charCodeAt(0))
        ) {
          const localPrevLetter = text[i - 2]
          const localCurrentLetter = currentLetter
          const localNextLetter = text[i + 1]
          const position1 = this.getCorrectForm(
            localCurrentLetter,
            localPrevLetter,
            localNextLetter,
            this.arabiclaasubst,
          )
          resultingLetter = String.fromCharCode(
            this.arabiclaasubst[currentLetter.charCodeAt(0)][position1],
          )
          result = result.substr(0, result.length - 1) + resultingLetter
        } else if (
          prevLetter !== undefined &&
          prevLetter.charCodeAt(0) == 1617 &&
          this.arrayContainsElement(
            this.diacritics,
            currentLetter.charCodeAt(0),
          )
        ) {
          const localPrevLetter = text[i - 2]
          const localCurrentLetter = currentLetter
          const localNextLetter = text[i + 1]
          const position2 = this.getCorrectForm(
            localCurrentLetter,
            localPrevLetter,
            localNextLetter,
            this.arabicorigsubst,
          )
          resultingLetter = String.fromCharCode(
            this.unicode_diacritics[currentLetter.charCodeAt(0)][position2],
          )
          result = result.substr(0, result.length - 1) + resultingLetter
        } else {
          const position3 = this.getCorrectForm(
            currentLetter,
            prevLetter,
            nextLetter,
            this.arabicorigsubst,
          )
          result += String.fromCharCode(
            this.arabicsubst[currentLetter.charCodeAt(0)][position3],
          )
        }
      }
    }
    return result
  }

  private showRowLimitPopup(): void {
    const message = this.translate.instant('public.rowLimitWarning', {
      value: this.maxAllowedRows,
    })
    this.smq.publish('error-mq', message)
  }

  protected getUnescapedStr(str) {
    if (str === null) {
      return ''
    }
    const txt = document.createElement('textarea')
    txt.innerHTML = unescape(str)
    return txt.value
  }
}
