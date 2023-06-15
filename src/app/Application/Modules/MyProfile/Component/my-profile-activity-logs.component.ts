import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { PopoverDirective } from 'ngx-bootstrap/popover'
import { Subscription } from 'rxjs'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { PagedData } from '../../../Model/paged-data'
import { StaticService } from '../../Common/Services/static.service'
import { CompanyAdminUserManagementListService } from '../../CompanyAdmin/CompanyUser/list/company-admin-user-management-list.service'
import { ModelServiceActivityLog } from '../Model/my-profile-activity-logs-service.model'
import { MyProfileActivityLogsService } from '../Services/my-profile-activity-logs.service'

@Component({
  selector: 'own-activity-logs',
  templateUrl: '../View/my-profile-activity-logs.component.html',
})
export class MyProfileActivityLogs
  extends DatatableMobileComponent
  implements OnInit, OnDestroy
{
  @ViewChild('popoverActivityDateTo')
  popoverBillDateTo: PopoverDirective
  @ViewChild('popoverActivityDateFrom')
  popoverBillDateFrom: PopoverDirective
  @ViewChild('activityLogTable', { static: true }) table: any

  @Input()
  isCompanyAdmin: boolean

  activityLogsPage: PagedData<ModelServiceActivityLog>

  authority: string
  operation: string
  dateFrom: Date
  dateTo: Date
  authoritySearch: string
  operationSearch: string
  dateFromSearch: Date
  dateToSearch: Date

  order: string
  orderType: string

  public isCollapsedContent = true
  public isVisiblesError = false
  public isVisiblesDateError = false
  public isVisiblesFutureDateError = false
  loading: boolean
  operations: any
  operationsDecode: any
  authorities: any
  openFromCalendar = true
  openToCalendar = true
  user: string
  isAdmin: boolean
  public users: any[] = []

  loadConfirmation = false

  bsConfig: any
  maxDate: Date

  subscriptions: Subscription[] = []
  combosSolicitados: string[] = ['activityOperationLog', 'authoritiesLevel']

  constructor(
    public service: MyProfileActivityLogsService,
    public staticService: StaticService,
    public translate: TranslateService,
    public router: Router,
    public authenticationService: AuthenticationService,
    private userMngService: CompanyAdminUserManagementListService,
  ) {
    super()
    this.activityLogsPage = new PagedData<ModelServiceActivityLog>()
    this.order = 'date'
    this.orderType = 'desc'
    this.operations = []
    this.authorities = []
    this.maxDate = new Date()
    this.user = ''
  }

  getAllTables(): any[] {
    const tablas = []
    tablas.push(this.table)
    return tablas
  }

  setPage(dataTableEvent) {
    if (dataTableEvent == null) {
      dataTableEvent = { offset: 0 }
    }

    this.activityLogsPage.page.pageNumber = dataTableEvent.offset

    this.loading = true

    this.service
      .getResults(
        this.authoritySearch,
        this.operationSearch,
        this.dateFromSearch,
        this.dateToSearch,
        this.order,
        this.orderType,
        this.activityLogsPage.page.pageNumber + 1,
        this.activityLogsPage.page.pageSize,
        this.user,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loading = false
          this.activityLogsPage = result
        }
      })
  }

  setSort(dataTableEvent) {
    if (dataTableEvent.sorts[0]) {
      this.order = dataTableEvent.sorts[0].prop
      this.orderType = dataTableEvent.sorts[0].dir
    }

    this.activityLogsPage.page.pageNumber = 1
    this.loading = true

    this.service
      .getResults(
        this.authoritySearch,
        this.operationSearch,
        this.dateFromSearch,
        this.dateToSearch,
        this.order,
        this.orderType,
        this.activityLogsPage.page.pageNumber,
        this.activityLogsPage.page.pageSize,
        this.user,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.activityLogsPage = result
          this.loading = false
        }
      })
  }

  onError(result) {
    this.loading = false
  }

  ngOnInit() {
    super.ngOnInit()

    this.isAdmin = this.authenticationService.activateOption(
      'ActivityLogs',
      [],
      ['CompanyAdmins'],
    )
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )

    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) =>
        this.refreshCombo(),
      ),
    )

    this.refreshCombo()
  }

  async refreshCombo() {
    this.staticService
      .getAllCombos(this.combosSolicitados)
      .subscribe((result) => {
        this.operations = []
        this.authorities = []

        const data: any = result
        this.operationsDecode =
          data[this.combosSolicitados.indexOf('activityOperationLog')]['values']
        this.operations.push({
          key: 'allTransactions',
          value: this.operationsDecode['allTransactions'],
        })

        Object.keys(this.operationsDecode).map((key, index) => {
          if (key != 'allTransactions') {
            this.operations.push({
              key,
              value: this.operationsDecode[key],
            })
          }
        })

        let valores
        valores =
          data[this.combosSolicitados.indexOf('authoritiesLevel')]['values']

        Object.keys(valores).map((key, index) => {
          this.authorities.push({ key, value: valores[key] })
        })

        // uncomment if order is a requirment. Some keys doesn't have same fisrt letter as value and order isn't not fully Ok
        // this.operations.sort(function(a, b){
        //     if(a.key < b.key) { return -1; }
        //     if(a.key > b.key) { return 1; }
        //     return 0;
        // });
        this.authorities.sort((a, b) => {
          if (a.key < b.key) {
            return -1
          }
          if (a.key > b.key) {
            return 1
          }
          return 0
        })

        this.authority = 'All'
        this.operation = 'allTransactions'
        this.authoritySearch = this.authority
        this.operationSearch = this.operation
        this.setPage(null)
      })

    if (!this.isAdmin) {
      return
    }

    this.processUsersList(1)
  }

  processUsersList(getPage = 1) {
    const page = getPage
    if (page == 1) {
      this.users = []
    }
    this.subscriptions.push(
      this.userMngService
        .getList({}, page, 100, 'name', 'ASC')
        .subscribe((r) => {
          if (r.data && r.data.length > 0) {
            r.data.forEach((u) => {
              this.users.push({ id: u.userId, name: u.userId })
            })
            if (page < r.page.totalPages) {
              this.processUsersList(page + 1)
            } else {
              this.users = this.users.sort((u1, u2) =>
                u1.name.localeCompare(u2.name),
              )
            }
          }
        }),
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  getActivityLogs() {
    this.authoritySearch = this.authority
    this.operationSearch = this.operation
    this.dateFromSearch = this.dateFrom
    this.dateToSearch = this.dateTo
    this.setPage({ offset: 0 })
  }

  requestReport() {
    this.loading = true

    this.service
      .requestReport(
        this.authoritySearch,
        this.operationSearch,
        this.dateFromSearch,
        this.dateToSearch,
        this.order,
        this.orderType,
        0,
        this.activityLogsPage.page.pageSize,
        this.user,
      )
      .subscribe((result) => {
        if (result === null) {
          this.onError(result)
        } else {
          this.loadConfirmation = true
          this.loading = false
        }
      })
  }

  public reset(event) {
    this.dateFrom = null
    this.dateTo = null
    this.authority = 'All'
    this.operation = 'allTransactions'
    this.activityLogsPage = new PagedData<ModelServiceActivityLog>()
    this.order = 'date'
    this.orderType = 'desc'
    this.user = ''
    this.getActivityLogs()
    event.preventDefault()
  }

  finish() {
    this.dateFrom = null
    this.dateTo = null
    this.authority = 'All'
    this.operation = 'allTransactions'
    this.activityLogsPage = new PagedData<ModelServiceActivityLog>()
    this.order = 'date'
    this.orderType = 'desc'
    this.getActivityLogs()
    this.loadConfirmation = false
  }

  correctDate() {
    if (this.dateTo < this.dateFrom) {
      this.isVisiblesDateError = true
    } else {
      this.isVisiblesDateError = false
    }
    if (this.dateFrom > new Date() || this.dateTo > new Date()) {
      this.isVisiblesFutureDateError = true
    } else {
      this.isVisiblesFutureDateError = false
    }
  }

  changeDateFrom(event) {
    if (this.openFromCalendar && this.dateFrom != null) {
      this.popoverBillDateFrom.hide()
      this.openFromCalendar = false
    } else {
      this.popoverBillDateFrom.show()
      this.openFromCalendar = true
    }
    this.correctDate()
  }

  showDateFrom(event) {
    this.popoverBillDateFrom.show()
  }

  hideDateFrom(event) {
    this.popoverBillDateFrom.hide()
  }

  changeDateTo(event) {
    if (this.openToCalendar && this.dateTo != null) {
      this.popoverBillDateTo.hide()
      this.openToCalendar = false
    } else {
      this.popoverBillDateTo.show()
      this.openToCalendar = true
    }
    this.correctDate()
  }

  showDateTo(event) {
    this.popoverBillDateTo.show()
  }

  hideDateTo(event) {
    this.popoverBillDateTo.hide()
  }

  click(event) {
    event.preventDefault()
  }

  public selecOperation(value: string) {
    sessionStorage.setItem('auditLinePk', value)
    this.router.navigate(['/myprofile/activityLogs/detail'])
  }

  public onChangeUser(user) {
    if (typeof user != 'undefined') {
      this.user = user
    } else {
      this.user = ''
    }
  }
}
