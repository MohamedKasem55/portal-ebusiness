import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewChecked,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { StadingOrdersService } from '../../Services/standingOrder.services'

@Component({
  templateUrl: '../../View/request-status.component.html',
  styles: [
    `
      @media screen and (max-width: 800px) {
        .desktop-hidden {
          display: initial;
        }
        .mobile-hidden {
          display: none;
          width: 0%;
        }
      }
      @media screen and (min-width: 800px) {
        .desktop-hidden {
          display: none;
        }
        .mobile-hidden {
          display: initial;
        }
      }
    `,
  ],
})
export class RequestStatusComponent
  extends DatatableMobileComponent
  implements OnInit, AfterViewChecked
{
  @ViewChild('table', { static: true }) table: any
  @ViewChild('levelsPopup', { static: true }) private levelsPopup

  public innerWidth: any
  public mobile = false
  tablePagedResults: any = {}
  tableDisplaySize = 20
  tableSubscription: Subscription

  constructor(
    private service: StadingOrdersService,
    public translate: TranslateService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId,
  ) {
    super()
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.innerWidth = window.innerWidth

    this.tablePagedResults.items = []
    this.tablePagedResults.size = 0
    this.tablePagedResults.total = 0

    this.setPage(null)

    window.addEventListener('resize', (res: Event) => {
      this.innerWidth = window.innerWidth
      if (this.innerWidth < 800) {
        this.mobile = true
        this.table.rowDetail.expandAllRows()
      } else {
        this.mobile = false
        this.table.rowDetail.collapseAllRows()
      }
    })
  }

  ngAfterViewChecked() {
    if (isPlatformBrowser(this.platformId) && this.innerWidth < 800) {
      if (this.tablePagedResults.item.length > 0) {
        this.mobile = true
        this.table.rowDetail.expandAllRows()
      }
    }
  }

  onDetailToggle(event) {}

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }

    this.tableSubscription = this.service
      .getList(pageInfo.offset + 1, this.tableDisplaySize)
      .subscribe((result) => {
        if (!result.error) {
          this.tablePagedResults.items = result.standingOrderList.items
          this.tablePagedResults.total = result.standingOrderList.total
        }
        this.tableSubscription.unsubscribe()
      })
  }

  back() {
    this.router.navigate(['/payments/stadingOrders'])
  }

  goActivate(row) {
    this.service.getBatch(row).subscribe((result) => {
      if (result.error) {
        return
      } else {
        this.service.setElement(result)
        this.router.navigate(['/payments/stadingOrders/requestStatus/activate'])
      }
    })
  }

  openModal(row): void {
    this.levelsPopup.openModal(row.securityLevelsDTOList)
  }
}
