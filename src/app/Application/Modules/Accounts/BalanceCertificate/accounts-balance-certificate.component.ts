import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { PagedData } from '../../../Model/paged-data'
import { ModelServiceBalanceCertificate } from '../Model/account-balance-cetificate-service.model'
import { AccountsService } from './accounts-balance-certificate.service'
import { ModelPipe } from '../../../Components/common/Pipes/model-pipe'

@Component({
  templateUrl: './accounts-balance-certificate.component.html',
})
export class AccountsBalanceCertificateComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('accountBalanceCertificateTable', { static: true }) table: any
  accountBalancePage: PagedData<ModelServiceBalanceCertificate>
  subscription: Subscription
  order: string
  orderType: string

  urlRequestStatus = ['/accounts/balanceCertificate/request-satatus']

  constructor(
    public service: AccountsService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super()
    this.accountBalancePage = new PagedData<ModelServiceBalanceCertificate>()
    this.order = 'requestDate'
    this.orderType = 'desc'
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.accountBalancePage.page.pageNumber = dataTableEvent.offset

    // Service Call
    this.subscription = this.service
      .getResults(
        this.order,
        this.orderType,
        dataTableEvent.offset + 1,
        this.accountBalancePage.page.pageSize,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError()
        } else {
          this.accountBalancePage = result
        }

        this.subscription.unsubscribe()
      })
  }

  setSort(dataTableEvent) {
    if (this.accountBalancePage.data.length != 0) {
      if (dataTableEvent.sorts[0]) {
        this.order = dataTableEvent.sorts[0].prop
        this.orderType = dataTableEvent.sorts[0].dir
      }
      if (!dataTableEvent.offset) {
        dataTableEvent.offset = 0
      }

      this.accountBalancePage.page.pageNumber = 1

      // Service Call with new short
      this.subscription = this.service
        .getResults(
          this.order,
          this.orderType,
          dataTableEvent.offset + 1,
          this.accountBalancePage.page.pageSize,
        )
        .subscribe((result) => {
          if (result === null) {
            this.onError()
          } else {
            this.accountBalancePage = result
          }

          this.subscription.unsubscribe()
        })
    }
  }

  onError() {
    //
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPage({ offset: 0, rows: 10 })
  }

  ngOnDestroy() {}

  goRequestStatus() {
    this.router.navigate(this.urlRequestStatus)
  }

  checkCityIsModelPipe(valor): boolean {
    if (valor.length === 8 && valor.indexOf('000', 0) !== -1) {
      return true
    }
    return false
  }

  public getExportedFieldValue(value, dataKey, row, injector, locale) {
    if (dataKey === 'city') {
      if (value.length === 8 && value.indexOf('000', 0) !== -1) {
        return new ModelPipe(injector).transform('cityType', value)
      } else {
        return value
      }
    }
    return ''
  }
}
