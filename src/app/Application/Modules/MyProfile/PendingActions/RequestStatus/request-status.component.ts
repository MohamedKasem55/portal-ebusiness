import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { RequestStatusService } from './request-status.service'

@Component({
  templateUrl: './request-status.component.html',
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('table', { static: true }) table: any
  tableSubscription: Subscription

  rows: any = []
  displaySize = 20

  constructor(
    private service: RequestStatusService,
    public translate: TranslateService,
    private router: Router,
  ) {
    super()
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.tableSubscription = this.service
      .getRequestStatusPendingActionsTable()
      .subscribe((result) => {
        this.rows = result['counters']
        this.rows.forEach((counter) => {
          if(counter['name']==='softToken'){//     CAMBIAR
            counter['nameExport'] ='Request Soft Token'
          } else {
            counter['nameExport'] = this.translate.instant(counter['name'])
          }
        })
        this.tableSubscription.unsubscribe()
      })
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  goToPending(route) {
    this.router.navigate([route])
  }

  ngOnInit() {
    super.ngOnInit()
    this.setPage(null)
    this.translate.onLangChange.subscribe((res) => {
      this.setPage(null)
    })
  }

  ngOnDestroy(): void {
    if (this.tableSubscription) {
      this.tableSubscription.unsubscribe()
    }
  }
}
