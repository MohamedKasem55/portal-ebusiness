import { Component, Injector, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { SimpleMQ } from 'ng2-simple-mq'
import { Subscription } from 'rxjs'
import { VatInvoiceService } from './vat-invoice.service'

@Component({
  templateUrl: './vat-invoice.component.html',
})
export class VatInvoiceComponent implements OnInit {
  form: FormGroup
  mensajeError = {}

  years: Date[] = []
  months: any[] = []

  monthsNames: any[] = [
    '',
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
  ]

  yearSelected = true

  actualDate: Date = new Date()

  messageSubscription: Subscription

  constructor(
    public translate: TranslateService,
    public vatservice: VatInvoiceService,
    public fb: FormBuilder,
    private smq: SimpleMQ,
    private injector: Injector,
  ) {
    this.form = this.fb.group({
      year: ['', [Validators.required]],
      month: [{ value: '', disabled: true }, [Validators.required]],
    })
  }

  ngOnInit() {
    let year = this.actualDate.getFullYear()
    for (let i = 0; i < 6; i++) {
      if (year >= 2018) {
        this.years.push(new Date())
        this.years[i].setFullYear(year)
      }
      year--
    }
  }
  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
  currentYear(year) {
    if (year) {
      year = Number(year.value)
      this.months = []
      if (year === this.actualDate.getFullYear()) {
        const month = this.actualDate.getMonth() + 1
        for (let j = 1; j <= month; j++) {
          this.months.push(j)
        }
      } else {
        for (let j = 1; j <= 12; j++) {
          this.months.push(j)
        }
      }
      if (this.form.controls.month.value) {
        this.form.controls.month.reset()
      }
      // if (this.form.get('month').status === 'DISABLED') {
      //   this.form.get('month').enable()
      // }
      if (this.form.get('year').value !== '') {
        this.form.get('month').enable()
      }
    }
  }

  searchVatInvoice() {
    let month = this.form.controls.month.value
    if (this.form.controls.month.value < 10) {
      month = `0${this.form.controls.month.value}`
    }

    this.vatservice
      .getPdf(month, this.form.controls.year.value)
      .subscribe((res) => {
        if (res.type == 'text/xml' || res.type == '') {
          const reader = new FileReader()
          reader.addEventListener(
            'loadend',
            function () {
              const output = JSON.parse(reader.result as string)
              this.handleError(output)
            }.bind(this),
          )
          reader.readAsText(res)
        } else {
          this.downloadFile(
            res,
            this.form.controls.year.value +
              '_' +
              this.form.controls.month.value +
              '.zip',
          )
        }
      })
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
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
