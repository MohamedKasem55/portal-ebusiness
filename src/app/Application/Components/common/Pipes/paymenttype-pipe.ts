import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'paymentType', pure: false })
export class PaymentPipe implements PipeTransform {
  lang: string

  constructor(private injector: Injector) {}
  // Function that returns the type of payment / transfer depending on the code obtained taking into account the language
  transform(valuePaymentType: string): string {
    this.lang = this.injector.get(TranslateService).currentLang

    if (valuePaymentType === '1') {
      return this.injector
        .get(TranslateService)
        .instant('transfer.transferRahji')
    } else if (valuePaymentType === '2') {
      return this.injector
        .get(TranslateService)
        .instant('transfer.transferLocal')
    } else if (valuePaymentType === '3') {
      return this.injector
        .get(TranslateService)
        .instant('transfer.transferInternational')
    } else if (valuePaymentType === '5') {
      return this.injector
        .get(TranslateService)
        .instant('transfer.transferLocalQuick')
    } else {
      return ''
    }
  }
}
