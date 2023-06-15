import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Exception } from '../../../Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { BeneficiariesListService } from '../Services/beneficiaries-list.service'

@Component({
  selector: 'app-beneficiary-details',
  templateUrl: '../View/details.component.html',
})
export class BeneficiaryDetailsComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @Input() beneficiary: any
  @Input() erNumber: any
  @ViewChild('beneficiaryListTable') beneficiaryListTable: any
  tableSelected: any = {}
  beneficiariesDetail: any = []
  subscriptions: any = []
  detailBeneficiary: any
  beneficiaryId: string
  type: string
  ernumber: string
  beneficiariesId: any
  types: any

  paymentsPage: any

  constructor(
    public serviceBeneficiaryList: BeneficiariesListService,
    public router: Router,
    public translate: TranslateService,
  ) {
    super()
    const page = new Page()
    this.paymentsPage = new PagedData<any>()
    page.pageNumber = 0
    page.pageSize = 20
    this.paymentsPage.page = page
  }

  ngOnInit(): void {
    this.setPage()
  }

  setPage() {
    this.beneficiaryId = this.beneficiary.idBeneficiary
    this.type = this.beneficiary.beneficiaryType
    this.ernumber = this.beneficiary.ernumber
    this.serviceBeneficiaryList
      .listDetails(this.type, this.ernumber, this.beneficiaryId)
      .subscribe((result: any) => {
        if (
          result.hasOwnProperty('error') &&
          result.error instanceof Exception
        ) {
          return
        } else {
          this.beneficiariesDetail = result.lastTransactionDetails
        }
      })
  }
}
