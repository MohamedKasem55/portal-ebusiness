import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from 'app/core/responsive/datatable-mobile.component'
import { SimpleMQ } from 'ng2-simple-mq'
import { interval, Subscription } from 'rxjs'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { ClaimShareService } from './claim-share.service'
import { ClaimService } from './claim.service'

@Component({
  selector: 'app-claim',
  templateUrl: './claim.component.html',
  styleUrls: ['./claim.component.scss'],
})
export class ClaimComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('pageTable', { static: true }) table: any

  urlClaim = ['/posstatement/claims/add-claim']
  urlBack = ['/posstatement']

  comboType = 'claimType'
  comboStatus = 'claimStatus'

  searchObject = {
    terminalNumber: [null, Validators.required],
    typeOfTransaction: [null],
    dateFrom: [''],
    dateTo: [''],
    amountFrom: [''],
    amountTo: [''],
    mobileNumber: [''],
    merchantNumber: [''],
    status: [null],
  }

  bsConfig: any

  types: any[]
  status: any[]
  terminals: any[]
  merchantNumber: any
  comboTerminal: any[]

  pageData: PagedData<any>

  private order: string
  private orderType: string

  tableSelectedRows: any = []

  isCollapsedContent = true

  data: any

  searchForm: FormGroup
  searchFormData: any

  subscriptions: Subscription[] = []

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public service: ClaimService,
    private smq: SimpleMQ,
    public requestShareService: ClaimShareService,
  ) {
    super()
    this.searchForm = this.fb.group(this.searchObject)
    this.searchFormData = Object.assign({}, this.searchForm.value)

    this.pageData = new PagedData<any>()
    this.pageData.data = []
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 20
    this.pageData.page = page
    this.order = 'userId'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'D/MM/YYYY' },
    )
    this.refreshCombos()
    this.subscriptions.push(
      this.service.getTerminals().subscribe((result) => {
        this.terminals = result.terminals
        this.merchantNumber = result.merchantId
        this.searchForm.controls.merchantNumber.patchValue(result.merchantId)
        this.comboTerminal = this.extractTerminalKeyValue(this.terminals)
        if (this.terminals && this.terminals.length > 0) {
          this.searchForm.controls.terminalNumber.patchValue(this.terminals[0])
          this.search()
        } else {
          this.subscriptions.push(
            this.translate.get('posRequest.noTerminals').subscribe((value) => {
              this.smq.publish('error-mq', value)
            }),
          )
        }
        this.searchForm.controls.terminalNumber.valueChanges.subscribe(() => {
          this.isCollapsedContent = false
          this.search()
        })
      }),
    )
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(
        function () {
          this.refreshCombos()
        }.bind(this),
      ),
    )
  }

  refreshCombos() {
    const combosSolicitados = ['claimType', 'claimStatus']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        this.types = []
        const index = Object.keys(
          data[combosSolicitados.indexOf('claimType')]['values'],
        ).sort(function (a, b) {
          //console.log(a,b);
          return data[combosSolicitados.indexOf('claimType')]['values'][a] >
            data[combosSolicitados.indexOf('claimType')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('claimType')]['values'][b] >
              data[combosSolicitados.indexOf('claimType')]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.types.push({
            key: index[i],
            value:
              data[combosSolicitados.indexOf('claimType')]['values'][index[i]],
          })
        }
        this.status = []
        const index2 = Object.keys(
          data[combosSolicitados.indexOf('claimStatus')]['values'],
        ).sort(function (a, b) {
          //console.log(a,b);
          return data[combosSolicitados.indexOf('claimStatus')]['values'][a] >
            data[combosSolicitados.indexOf('claimStatus')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('claimStatus')]['values'][b] >
              data[combosSolicitados.indexOf('claimStatus')]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index2.length; i++) {
          this.status.push({
            key: index2[i],
            value:
              data[combosSolicitados.indexOf('claimStatus')]['values'][
                index2[i]
              ],
          })
        }
      })
  }

  extractTerminalKeyValue(terminal: any) {
    const terminalKeyValue = []
    for (let i = 0; terminal.length > i; i++) {
      terminalKeyValue.push({ key: terminal[i], value: terminal[i] })
    }
    return terminalKeyValue
  }

  details(data) {
    this.requestShareService.setDataInit(data)
    /*this.router.navigate(this.urlModify);*/
  }

  goClaim() {
    //console.log('selected claim',this.tableSelectedRows);
    this.requestShareService.setSelectedData(this.tableSelectedRows)
    this.router.navigate(this.urlClaim)
  }

  isSelectedClaim() {
    return (
      this.tableSelectedRows &&
      this.tableSelectedRows.length > 0 &&
      this.searchForm.value.terminalNumber
    )
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.pageData.page.pageNumber = dataTableEvent.offset
    this.subscriptions.push(
      this.service
        .getTransactionList(
          this.searchFormData,
          this.pageData.page.pageNumber + 1,
          this.pageData.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError()
            return
          } else {
            this.data = result
            this.pageData.page = result.page
            this.pageData.data = result.data
          }
        }),
    )
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.pageData.page.pageNumber = 0

    this.subscriptions.push(
      this.service
        .getTransactionList(
          this.searchFormData,
          this.pageData.page.pageNumber + 1,
          this.pageData.page.pageSize,
          this.order,
          this.orderType,
        )
        .subscribe((result) => {
          if (result instanceof Exception) {
            this.onError()
            return
          } else {
            this.data = result
            this.pageData.page = result.page
            this.pageData.data = result.data
          }
        }),
    )
  }

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    return this.tableSelectedRows
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.searchFormData.terminalNumber =
      this.searchForm.get('terminalNumber').value
    if (!this.searchFormData.terminalNumber) {
      this.subscriptions.push(
        this.translate.get('posRequest.noTerminals').subscribe((value) => {
          this.smq.publish('error-mq', value)
        }),
      )
    } else {
      this.subscriptions.push(
        this.service
          .getTransactionList(
            this.searchFormData,
            1,
            this.pageData.page.pageSize,
            this.order,
            this.orderType,
          )
          .subscribe((result) => {
            if (result instanceof Exception) {
              this.onError()
              return
            } else {
              this.data = result
              this.pageData.page = result.page
              this.pageData.data = result.data
            }
          }),
      )
    }
  }

  reset() {
    this.searchForm.reset()
    this.search()
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError() {}

  getRowClass() {
    /*if(row.trxnProcessedFlg != 'N')
                return { 'red': true };
            else{
                return { 'green': true };
            }*/
    return {}
  }

  displayCheck(row) {
    return row.trxnProcessedFlg != 'N'
  }
}
