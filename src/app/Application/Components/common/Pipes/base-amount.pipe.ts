import { Inject, Injector, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'

import { StorageService } from '../../../../core/storage/storage.service'
import { AmountCurrencyPipe } from './amount-currency.pipe'

@Pipe({ name: 'baseAmount', pure: false })
export class BaseAmountPipe implements PipeTransform {
  public vat: number

  transform(value: number, currencyCode?: number): string {
    if (this.vat && value) {
      value = value / (1 + +this.vat / 100)
    }

    return new AmountCurrencyPipe(this.injector, this.locale).transform(
      value,
      null,
    )
  }

  constructor(
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
    private _storage: StorageService,
  ) {
    const parameters = this._storage.retrieve('parameters')
    this.vat = +parameters.items['vatPercentage'].value
  }
}
