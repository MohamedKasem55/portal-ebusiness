import { Component, OnInit } from '@angular/core'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { FeesService } from '../../fees.service'
import { BulkPaymentFees } from '../../model/bulkPaymentFees.interface'
import { Page } from 'app/Application/Model/page'
import { PagedData } from 'app/Application/Model/paged-data'
import { GeneralFee } from '../../model/general-fee.interface'
import { TranslateService } from '@ngx-translate/core'

@Component({
  templateUrl: './bulk-payments-fees-management.component.html',
  styleUrls: ['bulk-payments-fees-management.component.scss'],
  selector: 'app-bulk-payments-fees-management',
})
export class BulkPaymentsFeesManagementComponent
  extends DatatableMobileComponent
  implements OnInit
{
  public bulkPaymentFees: BulkPaymentFees

  public feesPage: PagedData<GeneralFee>
  public pageSize = 50
  public page = 0
  public tableDisplaySize = 50

  public vat: number

  constructor(
    private _feesService: FeesService,
    private _storage: StorageService,
    public translate: TranslateService,
  ) {
    super()
    this.feesPage = new PagedData<GeneralFee>()
  }

  public ngOnInit(): void {
    this._getBulkPaymentFees()
  }

  private _getBulkPaymentFees(): void {
    this._feesService.getBulkPaymentFees().subscribe((res) => {
      this.bulkPaymentFees = res.bulkPaymentsParametersDTO
      if (res.generalFees) {
        const page = 1
        const rows = 1000
        const output = {
          items: res.generalFees.items,
          size: res.generalFees.size,
          total: res.generalFees.total,
        }
        const pagedData = new PagedData<any>()
        const pageObject = new Page()

        pageObject.pageNumber = page
        pageObject.pageSize = rows
        pageObject.totalElements = output.total
        pageObject.size = output.size
        pageObject.totalPages = pageObject.totalElements / pageObject.pageSize

        pagedData.data = output['data'] ? output['data'] : output['items']
        pagedData.page = pageObject

        this.feesPage = pagedData
      } else {
        this.feesPage = new PagedData<GeneralFee>()
      }
    })
  }

  getFeesTranslationCode(code) {
    return (
      'bulkPaymentParams.' + (code.charAt(0).toLowerCase() + code.substring(1))
    )
  }
}
