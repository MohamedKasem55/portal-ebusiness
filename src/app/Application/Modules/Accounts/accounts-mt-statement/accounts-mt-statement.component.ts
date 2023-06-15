import { Component, Injector, OnDestroy, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import { Account } from '../../../Model/account'
import { AccountsMtStatementService } from './accounts-mt-statement.service'
@Component({
  selector: 'app-accounts-mt-statement',
  templateUrl: './accounts-mt-statement.component.html',
})
export class AccountsMtStatementComponent implements OnInit, OnDestroy {
  accounts: Account[]
  selectedaccount: string
  datedrpdwn: any[]
  monthdrpdwn: any[]
  selectedDay: string
  selectedMonth: string
  freq: string
  allAccounts: string
  subscriptions: Subscription[] = []
  selectedaccountnum: string
  data: any
  checkaccount: string
  userLang: string

  constructor(
    public mtsservice: AccountsMtStatementService,
    private translateSrv: TranslateService,
    private injector: Injector,
    private smq: SimpleMQ,
  ) {}

  ngOnInit() {
    this.mtsservice.list().subscribe((result) => {
      this.accounts = result.listAccount
      this.datedrpdwn = this.convert(result.days, 'full')
      this.monthdrpdwn = this.convert(result.months, 'month')
      this.selectedDay = result.days[0]
      this.selectedMonth = result.months[0]
    })

    this.checkaccount = 'All Selected'
    this.selectedaccount = 'All Selected'

    this.userLang = this.translateSrv.currentLang
  }

  ngOnDestroy() {
    for (const sub of this.subscriptions) {
      sub.unsubscribe()
    }
  }

  public doChangeAccount(accvalue) {
    this.checkaccount = accvalue.$ngOptionLabel
  }

  public downloadFile(): void {
    const allSelected = this.checkaccount == 'All Selected'

    this.data = {
      accountNumber: allSelected ? undefined : this.selectedaccount,
      allAccounts: allSelected,
      frequency: this.freq,
      finalDate:
        this.freq === 'Monthly'
          ? this.removeSlashes(this.selectedMonth)
          : this.removeSlashes(this.selectedDay),
    }

    this.subscriptions.push(
      this.mtsservice.getfilePdf(this.data).subscribe((res) => {
        if (
          res.type == 'text/xml' ||
          res.type == '' ||
          res.type == 'application/json'
        ) {
          const reader = new FileReader()
          reader.addEventListener('loadend', () => {
            const output = JSON.parse(JSON.stringify(reader.result))
            this.handleError(output)
          })
          reader.readAsText(res)
        } else {
          this.tryDownload(res)
        }
      }),
    )
  }

  private convert(dateList: string[], mode: 'full' | 'month'): any[] {
    const monthYearList: { date: string; formated: string }[] = []
    let parsedDate: Date
    let month, formated: string

    for (const date of dateList) {
      parsedDate = new Date(date)
      month = parsedDate.toLocaleString(this.userLang, { month: 'long' })

      if (mode === 'month') {
        formated = `${month} ${parsedDate.getFullYear()}`
      } else if (mode === 'full') {
        formated = `${parsedDate.getDate()} ${month} ${parsedDate.getFullYear()}`
      }

      monthYearList.push({ date, formated })
    }

    return monthYearList
  }

  private removeSlashes(date: string): string {
    return date.replace(/-/g, '')
  }

  private tryDownload(file): void {
    if (window.navigator.msSaveOrOpenBlob) {
      if (this.checkaccount == 'All Selected') {
        window.navigator.msSaveOrOpenBlob(file, 'mtFile.zip')
      } else {
        window.navigator.msSaveOrOpenBlob(file, 'mtFile.txt')
      }
    } else {
      const downloadUrl = URL.createObjectURL(file)
      const link = document.createElement('a')
      if (this.checkaccount == 'All Selected') {
        link.download = 'mtFile.zip'
      } else {
        link.download = 'mtFile.txt'
      }
      link.href = downloadUrl
      document.body.appendChild(link)
      link.click()
    }
  }

  private handleError(output) {
    if (typeof output === 'string') {
      output = JSON.parse(output)
    }
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
      } else {
        if (output.errorResponse) {
          if (this.injector.get(TranslateService).currentLang === 'ar') {
            message = output.errorResponse.arabicMessage
          } else {
            message = output.errorResponse.englishMessage
          }
        }
      }

      if (!message || message === '') {
        message = output.errorDescription
      }

      if (!message || message === '') {
        message = 'Operation not available'
      }

      this.subscriptions.push(
        this.translateSrv.get(message).subscribe((value) => {
          this.smq.publish('error-mq', value)
        }),
      )
    }
  }
}
