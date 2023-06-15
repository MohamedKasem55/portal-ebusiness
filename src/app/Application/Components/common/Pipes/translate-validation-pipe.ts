import { Injector, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

@Pipe({ name: 'trnaslateValidatoin', pure: false })
export class TranslateValidationPipe implements PipeTransform {
  constructor(private injector: Injector) {}

  transform(value: string): any {
    const validations = value.split('|')
    let translated = this.injector
      .get(TranslateService)
      .instant('validation.pattern')
    validations.forEach((v) => {
      if (v.includes('min')) {
        translated += v + ' ,'
      }

      if (v.includes('max')) {
        translated += v + ' ,'
      }
      switch (v) {
        case 'onlyNumbers':
        case 'numeric': {
          translated +=
            this.injector.get(TranslateService).instant('validation.numeric') +
            ' ,'
          break
        }

        case 'noArabic': {
          translated +=
            this.injector.get(TranslateService).instant('validation.noArabic') +
            ' ,'
          break
        }
        case 'noSpecialChar': {
          translated +=
            this.injector
              .get(TranslateService)
              .instant('validation.noSpecialChar') + ' ,'
          break
        }

        case 'noEngLetters': {
          translated +=
            this.injector
              .get(TranslateService)
              .instant('validation.noEngLetters') + ' ,'
          break
        }

        case 'onlyAlphabetic': {
          translated +=
            this.injector
              .get(TranslateService)
              .instant('validation.onlyAlphabetic') + ' ,'
          break
        }

        case 'upperCase': {
          translated +=
            this.injector
              .get(TranslateService)
              .instant('validation.upperCase') + ' ,'
          break
        }
      }
    })
    return translated
  }
}
