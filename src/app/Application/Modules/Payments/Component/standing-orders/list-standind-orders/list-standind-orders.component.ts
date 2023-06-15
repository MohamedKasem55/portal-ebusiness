import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewChecked,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core'
import { FormControl } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../../../core/security/authentication.service'
import { Page } from '../../../../../Model/page'
import { PagedData } from '../../../../../Model/paged-data'
import { StadingOrdersService } from '../../../Services/standingOrder.services'

@Component({
  selector: 'app-list-standind-orders',
  templateUrl: '../../../View/list-standind-orders.component.html',
  styleUrls: ['./list-standind-orders.component.scss'],
})
export class ListStandindOrdersComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy, AfterViewChecked
{
  @ViewChild('stantdingOrderTable') table: any

  authorization: any
  finalLevel: boolean = false
  standingSelectOrg: any

  @ViewChild('authorization') set content(content) {
    this.authorization = content
  }

  public innerWidth: any
  public mobile = false
  public stantdingOrderTablePage: PagedData<any>
  public accounts: any = []
  public accountSearch: FormControl
  public standingSelect: any
  public dateTo: Date
  public dateFrom: Date
  public dateFromCanBeModified: boolean
  public dayOfMonth: number
  public amountType: string
  public amount: number
  public sharedData: any = {}
  public sharedDataDelete: any = {}
  public wizardStep = 1

  public bsConfig: any

  subscriptions: Subscription[] = []

  constructor(
    private service: StadingOrdersService,
    public translate: TranslateService,
    public authenticationService: AuthenticationService,
    @Inject(PLATFORM_ID) private platformId,
  ) {
    super()
    this.stantdingOrderTablePage = new PagedData<any>()
    this.stantdingOrderTablePage.page = new Page()
    this.stantdingOrderTablePage.page.pageSize = 20
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  ngOnInit() {
    super.ngOnInit()
    this.innerWidth = window.innerWidth
    this.accountSearch = new FormControl()
    this.wizardStep = 1
    this.subscriptions.push(
      this.accountSearch.valueChanges.subscribe((value) => {
        this.service.setAccount(value)

        this.getStandingOrders()
      }),
    )
    this.comboAccount()

    window.addEventListener('resize', (res: Event) => {
      this.innerWidth = window.innerWidth
      if (this.innerWidth < 800 && this.wizardStep == 1) {
        this.mobile = true
        this.table.rowDetail.expandAllRows()
      } else if (this.wizardStep == 1) {
        this.mobile = false
        this.table.rowDetail.collapseAllRows()
      }
    })
  }

  ngAfterViewChecked() {
    if (
      isPlatformBrowser(this.platformId) &&
      this.innerWidth < 800 &&
      this.wizardStep == 1
    ) {
      if (this.stantdingOrderTablePage.data.length > 0) {
        this.mobile = true
        this.table.rowDetail.expandAllRows()
      }
    }
  }

  onDetailToggle(event) {}

  getStandingOrders() {
    this.subscriptions.push(
      this.service
        .getResults(
          this.accountSearch.value['fullAccountNumber'],
          this.stantdingOrderTablePage.page.pageSize,
        )
        .subscribe((result) => {
          if (result === null || result['errorCode']) {
            this.onError(result)
          } else {
            this.stantdingOrderTablePage = result
          }
        }),
    )
  }

  comboAccount() {
    this.subscriptions.push(
      this.service.comboAccontsStadingOder().subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.accounts = result
          if (this.accounts && this.accounts.length > 0) {
            this.accountSearch.patchValue(this.accounts[0])
            this.setSelectedAccount()
          }
        }
      }),
    )
  }

  setSelectedAccount() {
    this.service.setAccount(this.accountSearch.value)
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  public details(row) {
    this.wizardStep = 2
    this.standingSelect = row

    if (this.standingSelect.dateTo == null) {
      this.dateTo = this.standingSelect.dateTo
    } else {
      // this.dateTo = new Date(this.standingSelect.dateTo);
      this.dateTo = new Date(this.standingSelect.dateTo + 'T00:00:00')
    }

    this.dateFrom = new Date(this.standingSelect.dateFrom + 'T00:00:00')
    // this.dateFrom = new Date(this.standingSelect.dateFrom);
    this.dayOfMonth = this.standingSelect.dayOfMonth
    this.amountType = this.standingSelect.amountOption
    this.amount = this.standingSelect.amount
  }

  public onSelect($event) {
    this.wizardStep = 2
    this.standingSelect = $event.selected[0]

    if (this.standingSelect.dateTo == null)
      this.dateTo = this.standingSelect.dateTo
    else this.dateTo = new Date(this.standingSelect.dateTo)

    this.dateFrom = new Date(this.standingSelect.dateFrom)
    this.dayOfMonth = this.standingSelect.dayOfMonth
    this.amountType = this.standingSelect.amountOption
    this.amount = this.standingSelect.amount
  }

  public goModifyStep(step) {
    switch (step) {
      case 3:
        if (this.today().getTime() <= this.dateFrom.getTime()) {
          this.dateFromCanBeModified = true
        } else {
          this.dateFromCanBeModified = false
        }
        this.wizardStep = step
        break
      case 4:
        this.standingSelectOrg = JSON.parse(JSON.stringify(this.standingSelect))
        this.standingSelect.dateTo = this.dateTo
        this.standingSelect.dateFrom = this.dateFrom
        this.standingSelect.dayOfMonth = this.dayOfMonth
        this.standingSelect.amountOption = this.amountType
        this.standingSelect.amount = this.amount

        this.subscriptions.push(
          this.service.validate(this.standingSelect).subscribe((result) => {
            if (result.errorCode === '0') {
              this.sharedData['generateChallengeAndOTP'] =
                result['generateChallengeAndOTP']
              this.sharedData['requestValidate'] = null
              this.sharedData['standingOrderBatch'] =
                result['standingOrderBatch']
              this.wizardStep = step
            } else {
              const standingSelectOrg = JSON.parse(
                JSON.stringify(this.standingSelectOrg),
              )
              this.details(standingSelectOrg)
              this.goModifyStep(3)
            }
          }),
        )

        break
      case 5:
        this.subscriptions.push(
          this.service.confirmModify(this.sharedData).subscribe((result) => {
            if (result.errorCode === '0') {
              this.wizardStep = step
            }
          }),
        )

        break
    }
  }

  public goDeleteStep(step) {
    switch (step) {
      case 6:
        this.subscriptions.push(
          this.service
            .validateDelete(this.standingSelect)
            .subscribe((result) => {
              if (result.errorCode === '0') {
                this.sharedDataDelete['generateChallengeAndOTP'] =
                  result['generateChallengeAndOTP']
                this.sharedDataDelete['requestValidate'] = null
                this.sharedDataDelete['standingOrderBatch'] =
                  result['standingOrderBatch']
                this.finalLevel =
                  result['standingOrderBatch'].status === 'PROCESS'
                this.wizardStep = step
              }
            }),
        )

        break
      case 7:
        this.subscriptions.push(
          this.service
            .confirmDelete(this.sharedDataDelete)
            .subscribe((result) => {
              if (result.errorCode === '0') {
                this.wizardStep = step
              }
            }),
        )

        break
    }
  }

  public goBack(step) {
    this.wizardStep = step
    if (step == 2 && typeof this.standingSelectOrg != 'undefined') {
      this.details(this.standingSelectOrg)
    }
  }

  public principal() {
    this.wizardStep = 1
    this.getStandingOrders()
  }

  public today(): Date {
    return new Date()
  }

  public nextMonth(date: Date): Date {
    const month = date.getMonth()
    const year = date.getFullYear()
    const newDate: Date = new Date(year, month + 1)
    if (month < 11) {
      return newDate
    } else {
      return new Date(newDate.setFullYear(year + 1))
    }
  }

  onError(result) {}

  public monthBetweenDates(startDate: Date, endDate: Date) {
    if (endDate == null) {
      return 0
    }
    let month = (endDate.getFullYear() - startDate.getFullYear()) * 12
    month += endDate.getMonth() - startDate.getMonth()
    if (endDate.getDate() < startDate.getDate()) {
      month = month - 1
    }
    return month
  }

  public checkValidForm() {
    if (this.dateFromCanBeModified) {
      return (
        this.today().getTime() <= this.dateFrom.getTime() &&
        this.monthBetweenDates(this.dateFrom, this.dateTo) >= 1 &&
        this.amount &&
        this.amountType &&
        this.dayOfMonth
      )
    } else {
      return (
        this.monthBetweenDates(this.dateFrom, this.dateTo) >= 1 &&
        this.amount &&
        this.amountType &&
        this.dayOfMonth
      )
    }
  }

  public minDate(startDate: Date, days) {
    if (this.today().getTime() > startDate.getTime()) {
      return new Date(this.today().setDate(this.today().getDate() + days))
    } else {
      return startDate
    }
  }

  valid() {
    if (this.authorization) {
      return this.authorization.valid()
    } else {
      return true
    }
  }
}
