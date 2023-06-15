import { DecimalPipe } from '@angular/common'
import {
  Inject,
  Injector,
  LOCALE_ID,
  OnDestroy,
  Pipe,
  PipeTransform,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable, Subscription } from 'rxjs'
import { ModelService } from '../model.service'

@Pipe({ name: 'amountCurrency', pure: false })
export class AmountCurrencyPipe implements PipeTransform, OnDestroy {
  private currencyDecimalsArray: Array<Object> = []
  private subscriptions: Subscription[] = []
  transform(value: number, currencyCode?: string): string {
    const decimalPipe = new DecimalPipe(this.locale)
    if (currencyCode) {
      this.callServiceCurrencyDecimals()
      const currencyDecimalString = this.injector
        .get(ModelService)
        .retrieveValue(this.currencyDecimalsArray, currencyCode)
      if (currencyDecimalString) {
        const currencyDecimal = Number(currencyDecimalString)
        return decimalPipe.transform(
          value,
          '1.' + currencyDecimal + '-' + currencyDecimal,
        )
      } else {
        return ''
      }
    } else {
      if (value || value === 0) {
        return decimalPipe.transform(value, '1.2-2')
      }
      return ''
    }
  }

  callServiceCurrencyDecimals() {
    const currentLang = this.injector.get(TranslateService).currentLang

    const call = this.injector
      .get(ModelService)
      .getModel(currentLang, 'currencyDecimals')
    if (call instanceof Observable) {
      this.subscriptions.push(
        call.subscribe((result) => {
          this.currencyDecimalsArray = result
        }),
      )
    } else {
      this.currencyDecimalsArray = call
    }
  }

  constructor(
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe())
  }
}
