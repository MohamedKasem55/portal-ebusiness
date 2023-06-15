import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../../core/responsive/datatable-mobile.component'
import { BeneficiariesService } from '../../beneficiaries.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component extends DatatableMobileComponent implements OnInit {
  @ViewChild('withinTable', { static: true }) table: any

  step = 1
  sharedData: any = {}

  withinPagedResults: any = {}
  withinDisplaySize = 20
  withinSubscription: Subscription

  constructor(
    public service: BeneficiariesService,
    public translate: TranslateService,
  ) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.withinPagedResults.items = []
    this.withinPagedResults.size = 0
    this.withinPagedResults.total = 0
    this.sharedData.withinSelected = []
    this.setPageWithin(null)
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPageWithin(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
  }

  getId(row) {
    return row['customerId']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  onSelectWithin({ selected }) {
    //console.log('Select Event', selected, this.tableSelectedRows);
    this.sharedData.withinSelected.splice(
      0,
      this.sharedData.withinSelected.length,
    )
    this.sharedData.withinSelected.push(...selected)
  }
}
