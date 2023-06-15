import { Pipe, PipeTransform, Injector } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { PrePaidCardBlockService } from 'app/Application/Modules/PrePaidCard/PrePaidCardBlock/prePaidCardBlock.service'
import { PrePaidCardPaymentService } from 'app/Application/Modules/PrePaidCard/PrePaidCardPayment/prePaidCardPayment.service'

@Pipe({ name: 'prepaidCardOperationType', pure: false })
export class PrepaidCardOperationTypePipe implements PipeTransform {
  lang: string

  constructor(private injector: Injector) {}
  // Function that returns the type of payment / transfer depending on the code obtained taking into account the language
  transform(valueCardPaymentType: string): string {
    this.lang = this.injector.get(TranslateService).currentLang
    if (
      valueCardPaymentType.toString() ===
      PrePaidCardPaymentService.LOAD_FUNDS_TYPE
    ) {
      return this.injector
        .get(TranslateService)
        .instant('prePaidCard.loadFunds')
    } else if (
      valueCardPaymentType.toString() ===
      PrePaidCardPaymentService.REFUND_FUNDS_TYPE
    ) {
      return this.injector
        .get(TranslateService)
        .instant('prePaidCard.refundFunds')
    } else if (
      valueCardPaymentType.toString() ===
      PrePaidCardBlockService.REPLACE_OP_TYPE
    ) {
      return this.injector
        .get(TranslateService)
        .instant('prePaidCard.cardReplace')
    } else {
      return ''
    }
  }
}
