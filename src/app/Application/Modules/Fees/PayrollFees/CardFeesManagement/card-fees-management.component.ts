import { Component, OnInit, ViewChild } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PagedData } from 'app/Application/Model/paged-data'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StorageService } from '../../../../../core/storage/storage.service'
import { FeesService } from '../../fees.service'
import { PayrollCardFee } from '../../model/payroll-card-fee.interface'

@Component({
  templateUrl: 'card-fees-management.component.html',
})
export class CardFeesManagementComponent
  extends DatatableMobileComponent
  implements OnInit
{
  @ViewChild('feesTable', { static: true }) table: any

  public institutionId: string

  public feesPage: PagedData<PayrollCardFee>

  public vat: number

  public pageSize = 10
  public page = 0
  public tableDisplaySize = 10

  constructor(
    public translate: TranslateService,
    private _feesService: FeesService,
    private _storage: StorageService,
  ) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
    this._getVat()
    this._getPayrollCardFees()
  }

  getAllTables(): any[] {
    return [this.table]
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }
  }

  private _getPayrollCardFees(): void {
    this._feesService.getPayrollCardFees().subscribe((res) => {
      //console.log('res', res);
      this.institutionId = res.institutionId
      this.feesPage = res.listFees
    })
  }

  private _getVat(): void {
    const parameters = this._storage.retrieve('parameters')
    this.vat = +parameters.items['vatPercentage'].value
  }
}
