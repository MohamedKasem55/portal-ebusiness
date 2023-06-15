import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Page } from 'app/Application/Model/page'
import { PagedData } from 'app/Application/Model/paged-data'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { FeesService } from '../../fees.service'
import { GeneralFee } from '../../model/general-fee.interface'
import { PayrollCompanyDetails } from '../../model/payroll-company-details.interface'

@Component({
  templateUrl: './wps-payroll-fees-management.component.html',
  styleUrls: ['wps-payroll-fees-management.component.scss'],
  selector: 'app-wps-payroll-fees-management',
})
export class WPSPayrollFeesManagementComponent
  extends DatatableMobileComponent
  implements OnInit
{
  public payrollFees: PayrollCompanyDetails
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
  }

  public ngOnInit(): void {
    this._getPayrollFees()
    this._getVat()
  }

  private _getVat(): void {
    const parameters = this._storage.retrieve('parameters')
    this.vat = +parameters.items['vatPercentage'].value
  }

  private _getPayrollFees(): void {
    this._feesService.getWPSPayRollFees().subscribe((res) => {
      this.payrollFees = res.payrollCompanyDetails
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
}
