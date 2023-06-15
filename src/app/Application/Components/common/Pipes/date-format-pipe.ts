import { DatePipe } from '@angular/common'
import { Inject, Injector, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { StorageService } from '../../../../core/storage/storage.service'

@Pipe({ name: 'dateFormat', pure: false })
export class DateFormatPipe implements PipeTransform {
  transform(value: any, pattern: string): string | null {
    let locale = this.verifyLang()
    this.injector
      .get(TranslateService)
      .onLangChange.subscribe((event: LangChangeEvent) => {
        //
        if (event.lang === 'ar') {
          locale = 'ar-SA'
        }
        //console.log (this.injector.get(TranslateService).currentLang);
      })
    if (!value || value == '') {
      return ''
    }

    //  //console.log(locale)
    if (
      (value.constructor.name === 'String' ||
        value.constructor.name === 'string') &&
      value.indexOf('/') !== -1
    ) {
      const dateTimePieces = value.replace('T', ' ').split(' ')
      const datePieces = dateTimePieces[0].split('/')
      const timePieces =
        dateTimePieces.length > 1 ? ' ' + dateTimePieces[1] : ''
      const transformedValue =
        datePieces[2] + '-' + datePieces[1] + '-' + datePieces[0] + timePieces
      return new DatePipe(locale).transform(transformedValue, pattern)
    }
    return new DatePipe(locale).transform(value, pattern)
  }

  constructor(
    private injector: Injector,
    @Inject(LOCALE_ID) private _locale: string = null,
  ) {}

  verifyLang() {
    let lang = this.injector.get(TranslateService).currentLang
    const currentLang = this.injector
      .get(StorageService)
      .retrieve('currentLanguage')
    if (lang == null || lang == 'undefined') {
      lang =
        currentLang != 'undefined' && currentLang != null ? currentLang : 'ar'

      return lang
    } else {
      return lang
    }
  }
}
