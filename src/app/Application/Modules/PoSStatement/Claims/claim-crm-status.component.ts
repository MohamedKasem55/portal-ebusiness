import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Router } from '@angular/router'

import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { ClaimService } from './claim.service'
import { StaticService } from '../../Common/Services/static.service'

@Component({
  selector: 'app-claim-crm-status',
  templateUrl: './claim-crm-status.component.html',
  styleUrls: ['./claim-crm-status.component.scss'],
})
export class ClaimCRMStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any
  urlRequestStatus = ['/posstatement/claims/request-status']
  urlAdd = ['/posstatement/claims/add']
  urlActivate = ['/posstatement/claims/details']

  comboType = 'claimType'
  comboStatus = 'claimStatus'

  searchForm: FormGroup
  searchFormData: any
  searchObject = {
    terminalNumber: [null],
    typeOfClaim: [null],
    dateFrom: [''],
    dateTo: [''],
    amountFrom: [''],
    amountTo: [''],
    idClaim: [''],
    status: [null],
  }

  isCollapsedContent = true

  types: any[] = []
  status: any[] = []
  terminals: any[]
  comboTerminal: any[]

  requestStatusSubscription: Subscription
  subscriptions: Subscription[] = []
  requestStatus: any = {}
  tableDisplaySize = 20

  bsConfig: any

  constructor(
    public fb: FormBuilder,
    public staticService: StaticService,
    public service: ClaimService,
    private translate: TranslateService,
    public router: Router,
  ) {
    super()
    this.searchForm = this.fb.group(this.searchObject)
    this.searchFormData = Object.assign({}, this.searchForm.value)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
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
        this.terminals = result.terminals
        this.comboTerminal = this.extractTerminalKeyValue(this.terminals)
      }),
    )
    this.subscriptions.push(
      this.translate.onLangChange.subscribe(() => {
        this.refreshCombos()
      }),
    )
  }

  refreshCombos() {
    const combosSolicitados = [this.comboType, this.comboStatus]
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: any = comboData
        const type = this.comboType
        const status = this.comboStatus

        const index = Object.keys(
          data[combosSolicitados.indexOf(type)]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf(type)]['values'][a] >
            data[combosSolicitados.indexOf(type)]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf(type)]['values'][b] >
              data[combosSolicitados.indexOf(type)]['values'][a]
            ? -1
            : 0
        })
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < index.length; i++) {
          this.types.push({
            key: index[i],
            value: data[combosSolicitados.indexOf(type)]['values'][index[i]],
          })
        }
        this.status = []
        const index2 = Object.keys(
          data[combosSolicitados.indexOf(status)]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf(status)]['values'][a] >
            data[combosSolicitados.indexOf(status)]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf(status)]['values'][b] >
              data[combosSolicitados.indexOf(status)]['values'][a]
            ? -1
            : 0
        })
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < index2.length; i++) {
          this.status.push({
            key: index2[i],
            value: data[combosSolicitados.indexOf(status)]['values'][index2[i]],
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

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
    this.requestStatusSubscription = this.service
      .getData(this.searchFormData, pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.elements = result.batchList.items
          this.requestStatus.size = result.batchList.size
          this.requestStatus.total = result.batchList.total
        }
        this.requestStatusSubscription.unsubscribe()
      })
  }

  goDetails(row) {
    this.service.details(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.service.setDataElement(result)
        this.router.navigate(this.urlActivate)
      }
    })
  }

  goAdd() {
    this.router.navigate(this.urlAdd)
  }

  search() {
    this.searchFormData = Object.assign({}, this.searchForm.value)
    this.requestStatusSubscription = this.service
      .getData(this.searchFormData, 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.requestStatus.elements = result.batchList.items
          this.requestStatus.size = result.batchList.size
          this.requestStatus.total = result.batchList.total
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

  goRequestStatus() {
    this.router.navigate(this.urlRequestStatus)
  }
}
