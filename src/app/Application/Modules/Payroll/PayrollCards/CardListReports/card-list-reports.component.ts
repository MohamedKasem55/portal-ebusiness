import { Component, Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import { CardListReportsService } from './card-list-reports.service'

@Component({
  selector: 'app-card-list-reports',
  templateUrl: './card-list-reports.component.html',
  styleUrls: ['./card-list-reports.component.scss'],
})
export class CardListReportsComponent {
  cardListReportsSubscription: Subscription
  kYCListReportsSubscription: Subscription
  cardExpiryListSubscription: Subscription
  idExpiryListSubscription: Subscription
  messageSubscription: Subscription
  status: boolean

  constructor(
    private cardListReportsService: CardListReportsService,
    public translate: TranslateService,
    private smq: SimpleMQ,
    private injector: Injector,
  ) {}

  cardList() {
    this.cardListReportsSubscription = this.cardListReportsService
      .downloadCardList()
      .subscribe((res) => {
        this.cardListReportsSubscription.unsubscribe()
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(JSON.stringify(reader.result))
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'cardList.csv')
        }
      })
  }

  KYCList() {
    this.kYCListReportsSubscription = this.cardListReportsService
      .downloadKYCLists()
      .subscribe((res) => {
        this.kYCListReportsSubscription.unsubscribe()
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(JSON.stringify(reader.result))
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'KYCList.csv')
        }
      })
  }

  cardExpiryList() {
    this.cardExpiryListSubscription = this.cardListReportsService
      .downloadCardExpiryList()
      .subscribe((res) => {
        this.cardExpiryListSubscription.unsubscribe()
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(JSON.stringify(reader.result))
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'cardExpiryList.csv')
        }
      })
  }

  idExpiryList() {
    this.idExpiryListSubscription = this.cardListReportsService
      .downloadIDExpiryList()
      .subscribe((res) => {
        this.idExpiryListSubscription.unsubscribe()
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(JSON.stringify(reader.result))
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(res, 'IDExpiryList.csv')
        }
      })
  }

  downloadFile(blob, name) {
    if (blob === null) {
    } else {
      const blobObject = blob
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blobObject, name)
      } else {
        const downloadUrl = URL.createObjectURL(blobObject)
        const link = document.createElement('a')
        link.download = name
        link.href = downloadUrl
        document.body.appendChild(link)
        link.click()
      }
    }
  }

  handleError(output) {
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
      this.translate.get(message).subscribe((value) => {
        this.smq.publish('error-mq', value)
      })
    }
  }
}
