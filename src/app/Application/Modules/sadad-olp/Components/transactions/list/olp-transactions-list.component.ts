import { Component, OnInit, OnDestroy } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Router } from '@angular/router'
import { FormBuilder } from '@angular/forms'

import { AbstractDatatableMobileComponent } from '../../../../Common/Components/Abstract/abstract-datatable-mobile.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { StaticService } from '../../../../Common/Services/static.service'
import { OLPTransactionsListService } from './olp-transactions-list.service'
import { ManageOLPTransactionEntityService } from '../olp-transactions-entity.service'

@Component({
  selector: 'app-transactions-list-form',
  templateUrl: './olp-transactions-list.component.html',
  styleUrls: ['./olp-transactions-list.component.scss'],
})
export class OLPTransactionsListComponent
  extends AbstractDatatableMobileComponent
  implements OnInit, OnDestroy
{
  transactionStatusSelect: any[] = []

  constructor(
    public fb: FormBuilder,
    public service: OLPTransactionsListService,
    public translate: TranslateService,
    public staticService: StaticService,
    private serviceData: ManageOLPTransactionEntityService,
    public authenticationService: AuthenticationService,
    public router: Router,
  ) {
    super(fb, translate, authenticationService, router)

    this.order = 'transactionStatus'
    this.orderType = 'desc'

    this.searchForm = this.fb.group({
      transactionID: [],
      transactionStatus: [],
      dateFrom: [''],
      dateTo: [''],
    })
  }

  getId(row) {
    return row['transactionID']
  }

  refreshData() {
    const combosSolicitados = ['sadadOLPTransactionStatus']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        this.transactionStatusSelect = this.staticRecoverValues(
          combosSolicitados,
          data,
          'sadadOLPTransactionStatus',
        )
      })
  }

  getList(searchElement, order, orderType, offset, pageSize) {
    this.subscriptions.push(
      this.service
        .getResults(searchElement, order, orderType, offset, pageSize)
        .subscribe((result) => {
          if (result === null) {
            this.onError(result)
          } else {
            this.elementsPage = result
          }
        }),
    )
  }

  onSelect({ selected }) {
    this.tableSelectedRows = []
    this.tableSelectedRows.splice(0, selected.length)
    this.tableSelectedRows.push(...selected)
    this.serviceData.setSelectedData(this.tableSelectedRows)
    return this.tableSelectedRows
  }

  ngOnInit() {
    super.ngOnInit()
    this.search()
  }

  ngOnDestroy() {
    super.ngOnDestroy()
  }
}
