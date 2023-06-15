import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'

import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { ClaimService } from '../claim.service'
import { RequestStatusService } from './request-status.service'
import { StaticService } from '../../../Common/Services/static.service'

@Component({
  selector: 'app-request-status',
  templateUrl: './request-status.component.html',
  styleUrls: ['./request-status.component.scss'],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any

  urlActivate = ['/posstatement/claims/request-status/activate']

  comboType = 'typeTransactionClaim'
  comboStatus = 'statusTransaction'

  searchForm: FormGroup
  searchFormData: any
  searchObject = {
    terminalNumber: [null],
    typeOfClaim: [null],
    dateFrom: [''],
    dateTo: [''],
    amountFrom: [null],
    amountTo: [null],
    idClaim: [''],
    status: [null],
  }

  isCollapsedContent = true

  types: any[]
  status: any[]
  terminals: any[]
  comboTerminal: any[]

  requestStatusSubscription: Subscription
  subscriptions: Subscription[] = []
  requestStatus: any = {}
  tableDisplaySize = 20

  bsConfig: any

  constructor(
    public fb: FormBuilder,
    private requestStatusService: RequestStatusService,
    public staticService: StaticService,
    public service: ClaimService,
    private translate: TranslateService,
    public router: Router,
  ) {
    super()
    this.searchForm = this.fb.group(this.searchObject)
    this.searchFormData = Object.assign({}, this.searchForm.value)
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.bsConfig = Object.assign(
      {},
      { containerClass: 'theme-dark-blue' },
      { dateInputFormat: 'D/MM/YYYY' },
    )

    this.requestStatus.elements = []
    this.requestStatus.size = 0
    this.requestStatus.total = 0
    this.setPage(null)
    this.refreshCombos()
    this.subscriptions.push(
      this.service.getTerminals().subscribe((result) => {
        this.terminals = result.accountListDTO
        this.comboTerminal = this.extractTerminalKeyValue(this.terminals)
      }),
    )
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(() => {
        this.refreshCombos()
      }),
    )
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  refreshCombos() {
    const combosSolicitados = [this.comboType, this.comboStatus]
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        this.types = []
        const index = Object.keys(
          data[combosSolicitados.indexOf(this.comboType)]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf(this.comboType)]['values'][a] >
            data[combosSolicitados.indexOf(this.comboType)]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf(this.comboType)]['values'][b] >
              data[combosSolicitados.indexOf(this.comboType)]['values'][a]
            ? -1
            : 0
        })
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < index.length; i++) {
          this.types.push({
            key: index[i],
            value:
              data[combosSolicitados.indexOf(this.comboType)]['values'][
                index[i]
              ],
          })
        }
        this.status = []
        const index2 = Object.keys(
          data[combosSolicitados.indexOf(this.comboType)]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf(this.comboType)]['values'][a] >
            data[combosSolicitados.indexOf(this.comboType)]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf(this.comboType)]['values'][b] >
              data[combosSolicitados.indexOf(this.comboType)]['values'][a]
            ? -1
            : 0
        })
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < index2.length; i++) {
          this.status.push({
            key: index2[i],
            value:
              data[combosSolicitados.indexOf(this.comboType)]['values'][
                index2[i]
              ],
          })
        }
      })
  }

  extractTerminalKeyValue(account: any) {
    const terminalKeyValue = []
    for (let i = 0; account.length > i; i++) {
      terminalKeyValue.push({ key: i, value: account[i] })
    }
    return terminalKeyValue
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestStatusSubscription = this.requestStatusService
      .getData(this.searchFormData, pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.elements = result.posClaimBatchList.items
          this.requestStatus.size = result.posClaimBatchList.size
          this.requestStatus.total = result.posClaimBatchList.total
        }
        this.requestStatusSubscription.unsubscribe()
      })
  }

  goDetails(row) {
    this.requestStatusService.setDataElement(row)
    this.router.navigate(this.urlActivate)
  }

  goActivate(row) {
    this.requestStatusService.setDataElement(row)
    this.router.navigate(this.urlActivate)
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.requestStatusSubscription = this.requestStatusService
      .getData(this.searchFormData, 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.elements = result.posClaimBatchList.items
          this.requestStatus.size = result.posClaimBatchList.size
          this.requestStatus.total = result.posClaimBatchList.total
        }
        this.requestStatusSubscription.unsubscribe()
      })
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
}
