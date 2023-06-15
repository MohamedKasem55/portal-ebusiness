import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'businessCardStatus', pure: false })
export class BusinessCardStatusPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(param: string): any {
    let value = ''

    switch (param) {
      case '1':
        value = this.injector
          .get(TranslateService)
          .instant('commercialCards.cardStatus.closed')
        break
      case '2':
        value = this.injector
          .get(TranslateService)
          .instant('commercialCards.cardStatus.active')
        break
      case '3':
        value = this.injector
          .get(TranslateService)
          .instant('commercialCards.cardStatus.inActive')
        break
      case '4':
        value = this.injector
          .get(TranslateService)
          .instant('commercialCards.cardStatus.closedByBank')
        break
      case '5':
        value = this.injector
          .get(TranslateService)
          .instant('commercialCards.cardStatus.closedByCustomer')
        break
    }

    return value
  }
}
