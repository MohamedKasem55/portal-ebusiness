import {
  Component,
  EventEmitter,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import { CalendarService } from '../../../../core/calendar/calendar.service'
import { DatatableMobileComponent } from '../../../../core/responsive/datatable-mobile.component'
import { Exception } from 'app/Application/Model/exception'
import { Page } from '../../../Model/page'
import { PagedData } from '../../../Model/paged-data'
import { AccountsList } from '../Services/accounts-list-data.service'
import { MonthlyStatementsService } from './accounts-monthly-statements.service'
import { Account } from 'app/Application/Model/account'

@Component({
  selector: 'app-monthly-statements',
  templateUrl: './accounts-monthly-statements.component.html',
})
export class MonthlyStatementsComponent
  extends DatatableMobileComponent
  implements OnInit, OnDestroy, OnChanges
{
  @ViewChild('monthlyStatementsTable', { static: true }) table: any

  @Input()
  monthlyStatements: PagedData<Account>

  @Input()
  footerHeightSize: any

  @Output()
  changePage: EventEmitter<any> = new EventEmitter()

  accounts: object[]
  statements: object[]
  account: string = ''

  sharedData: any = {}
  subscriptions: Subscription[] = []
  accountFrom: any
  accountList

  constructor(
    public service: MonthlyStatementsService,
    public calendarService: CalendarService,
    public router: Router,
    public translate: TranslateService,
    public listService: AccountsList,
    private injector: Injector,
    private smq: SimpleMQ,
  ) {
    super()
    this.monthlyStatements = new PagedData<any>()
    this.monthlyStatements.data = []
    const page = new Page()
    page.pageNumber = 0
    page.pageSize = 12
    this.monthlyStatements.page = page
  }

  public ngOnChanges() {
    this.footerHeight = this.footerHeightSize
  }

  ngOnInit() {
    this.service.getAccounts().subscribe((result) => {
      this.accounts = result
    })
    this.listService.getAccountsList().subscribe((data) => {
      this.accountFrom = this.extractAccountKeyValue(data.listAccount)
    })
    if (this.account) {
      this.getStatements()
    }
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
  getStatements() {
    if (this.account) {
      this.subscriptions.push(
        this.service.getStatementList(this.account).subscribe((result) => {
          if (
            result.hasOwnProperty('error') &&
            (<any>result).error instanceof Exception
          ) {
            return
          } else {
            this.monthlyStatements.data = result.listStatement
            this.monthlyStatements.page.size =
              this.monthlyStatements.page.pageSize
            this.monthlyStatements.page.totalElements =
              result.listStatement.length
          }
        }),
      )
    }
  }

  accountSelected() {
    this.getStatements()
  }

  getMonthFullName(month: number): string {
    return this.calendarService.getI18nCalendar().getMonthFullName(month)
  }

  downloadFile(row) {
    if (!row.choosenFile) {
      return
    }

    this.subscriptions.push(
      this.service.getPdf(row.choosenFile).subscribe((res) => {
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const output = JSON.parse(reader.result as string)
            this.handleError(output)
          })
          reader.readAsText(res)
        } else if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(
            res,
            row.choosenFile.substr(row.choosenFile.lastIndexOf('/') + 1),
          )
        } else {
          const downloadUrl = URL.createObjectURL(res)
          const link = document.createElement('a')
          link.download = row.choosenFile.substr(
            row.choosenFile.lastIndexOf('/') + 1,
          )
          link.href = downloadUrl
          document.body.appendChild(link)
          link.click()
        }
      }),
    )
  }

  private handleError(output) {
    if (output.errorCode && output.errorCode !== '0') {
      let message: string
      if (output.errorCode === '-2') {
        message = 'Following fields contains error:<br/>'
        for (const entry of output.fieldErrors) {
          message =
            message +
            '<b> - Field: ' +
            entry.field +
            ' Error: ' +
            entry.message +
            '</b><br/>'
        }
      } else if (output.errorResponse) {
        if (this.injector.get(TranslateService).currentLang === 'ar') {
          message = output.errorResponse.arabicMessage
        } else {
          message = output.errorResponse.englishMessage
        }
      }

      if (!message || message === '') {
        message = output.errorDescription
      }

      if (!message || message === '') {
        message = 'Operation not available'
      }

      this.translate
        .get(message)
        .subscribe((value) => this.smq.publish('error-mq', value))
    }
  }
}
