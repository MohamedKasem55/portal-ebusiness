import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'moiPaymentType', pure: false })
export class MoiPaymentPipe implements PipeTransform {
  lang: string

  constructor(private injector: Injector) {}
  // Function that returns the type of moi payments 
  transform(valuePaymentType: string): string {
    this.lang = this.injector.get(TranslateService).currentLang
    console.log("MoiPaymentPipe: ",valuePaymentType)
    if (valuePaymentType === 'P') {
      return this.injector
        .get(TranslateService)
        .instant('payments.moiPayments.refund')
    } else if (valuePaymentType === 'R') {
      return this.injector
        .get(TranslateService)
        .instant('payments.moiPayments.payment')
    } else {
      return ''
    }
  }
}
