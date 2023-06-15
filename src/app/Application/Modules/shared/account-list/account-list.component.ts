import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
  OnInit,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { Account } from '../../../Model/account'
import { PagedData } from '../../../Model/paged-data'

@Component({
  templateUrl: './account-list.component.html',
  styleUrls: ['./account-list.component.scss'],
  selector: 'app-account-list',
})
export class AccountListComponent
  extends DatatableMobileComponent
  implements OnInit, OnChanges
{
  @Input()
  accountBalancePage: PagedData<Account>

  @Input()
  shouldCollapse: boolean

  @Input()
  showFooterPaginator = true

  // @Input()
  // footerHeightSize: any

  @Output()
  sortAccounts: EventEmitter<any> = new EventEmitter()

  @Output()
  accountDetail: EventEmitter<string> = new EventEmitter()

  @Output()
  changePage: EventEmitter<any> = new EventEmitter()

  @ViewChild('accountBalanceTable', { static: false }) table: any

  constructor(
    public authenticationService: AuthenticationService,
    public translate: TranslateService,
  ) {
    super()
  }

  ngOnInit() {
    super.ngOnInit()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  public ngOnChanges() {
    if (!this.shouldCollapse) {
      if (this.table && this.table.rowDetail) {
        this.table.rowDetail.expandAllRows()
      }
    } else {
      if (this.table && this.table.rowDetail) {
        this.table.rowDetail.collapseAllRows()
      }
    }
    this.footerHeight = 74
    // if (this.showFooterPaginator) {
    //   this.footerHeight = this.footerHeightSize
    // } else {
    //   this.footerHeight = 0
    // }
  }

  public setSort(event: any): void {
    this.sortAccounts.emit(event)
  }

  public details(fullAccountNumber: string): void {
    this.accountDetail.emit(fullAccountNumber)
  }

  public setPage(event): void {
    // this.accountBalancePage.page.pageNumber--
    this.changePage.emit(event)
    // if (!event) {
    //   this.changePage.emit(this.accountBalancePage.page)
    // } else {
    //   this.changePage.emit(event)
    // }
  }

  onChangeSize(size) {
    const event = {
      count: this.accountBalancePage.page.totalElements,
      limit: this.accountBalancePage.page.pageSize,
      offset: 0,
      pageSize: size,
    }
    this.changePage.emit(event)
  }
}
