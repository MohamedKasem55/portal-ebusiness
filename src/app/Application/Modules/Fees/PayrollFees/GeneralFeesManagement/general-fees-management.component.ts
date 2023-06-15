import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PagedData } from 'app/Application/Model/paged-data'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { Page } from '../../../../Model/page'
import { FeesService } from '../../fees.service'
import { GeneralFee } from '../../model/general-fee.interface'

@Component({
  templateUrl: './general-fees-management.component.html',
})
export class GeneralFeesManagement
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('feesTable', { static: true }) table: any

  public feesPage: PagedData<GeneralFee>
  public vat: number

  public pageSize = 50
  public page = 0
  public tableDisplaySize = 50

  constructor(
    public translate: TranslateService,
    private _feesService: FeesService,
    private _storage: StorageService,
  ) {
    super()
  }

  public ngOnInit(): void {
    super.ngOnInit()
    this._getGeneralFees()
    this._getVat()
    this.feesPage = new PagedData<GeneralFee>()
  }

  private _getGeneralFees(): void {
    this._feesService.getGeneralFees().subscribe((res) => {
      if (res) {
        const page = 1
        const rows = 1000
        const output = {
          items: res.items,
          size: res.size,
          total: res.total,
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

  getAllTables(): any[] {
    return [this.table]
  }

  public setPage(event: number): void {
    this.tableDisplaySize = event
  }

  private _getVat(): void {
    const parameters = this._storage.retrieve('parameters')
    this.vat = +parameters.items['vatPercentage'].value
  }
}
