import { Pipe, PipeTransform, Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'cardPaymentType', pure: false })
export class CardPaymentTypePipe implements PipeTransform {
  lang: string

  constructor(private injector: Injector) {}
  // Function that returns the type of payment / transfer depending on the code obtained taking into account the language
  transform(valueCardPaymentType: string): string {
    this.lang = this.injector.get(TranslateService).currentLang
    if (valueCardPaymentType.toString() === '0') {
      return this.injector
        .get(TranslateService)
        .instant('commercialCards.dueAmount')
    } else if (valueCardPaymentType.toString() === '1') {
      return this.injector
        .get(TranslateService)
        .instant('commercialCards.outstandingAmount')
    } else if (valueCardPaymentType.toString() === '2') {
      return this.injector
        .get(TranslateService)
        .instant('commercialCards.custom')
    } else {
      return ''
    }
  }
}
