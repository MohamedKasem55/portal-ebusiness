import { Injector, OnDestroy, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { BillPaymentService } from '../../../Modules/Payments/bill/bill-payments/bill-payment.service'

@Pipe({ name: 'billCode', pure: false })
export class BillCodePipe implements PipeTransform, OnDestroy {
  private firstCall = true
  private result = ''
  private subscriptions: Subscription[] = []

  transform(value: number, billCodes: any[]): string {
    if (this.firstCall) {
      if (billCodes) {
        this.result = this.fotmatData(value, billCodes)
        //this.injector.get(ChangeDetectorRef).detach();
      } else {
        //this.injector.get(ChangeDetectorRef).detach();
        this.subscriptions.push(
          this.injector
            .get(BillPaymentService)
            .getBillCodes()
            .subscribe((result) => {
              if (result.error) {
              } else {
                this.result = this.fotmatData(value, result.billCodes)
                //this.injector.get(ChangeDetectorRef).detectChanges();
              }
            }),
        )
      }
      this.firstCall = false
    }
    return this.result
  }

  fotmatData(value, billCodes) {
    for (let i = 0; i < billCodes.length; i++) {
      const billCode = billCodes[i]
      if (billCode.billCode == value) {
        if (this.injector.get(TranslateService).currentLang === 'ar') {
          return billCode.detailsDescriptionAr
        } else {
          return billCode.detailsDescriptionEn
        }
      }
    }
    return ''
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
  constructor(private injector: Injector) {}
}
