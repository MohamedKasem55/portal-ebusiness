import { DatePipe } from '@angular/common'
import { Inject, Injector, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

// tslint:disable-next-line:no-var-requires
const moment = require('moment-hijri')

@Pipe({ name: 'translateDate', pure: false })
export class TranslateDatePipe implements PipeTransform {
  datePipe: DatePipe

  transform(value: any, pattern: string): string | null {
    if (!value || value == '') {
      return ''
    }

    if (this.injector.get(TranslateService).currentLang === 'en') {
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
        return this.datePipe.transform(transformedValue, pattern)
      }
      return this.datePipe.transform(value, pattern)
    } else {
      if (pattern == 'short') {
        pattern = 'dd/mm/yyyy'
      }
      pattern = pattern.toUpperCase()
      pattern = pattern.replace(/MM/g, 'iMM')
      pattern = pattern.replace(/DD/g, 'iDD')
      pattern = pattern.replace(/YYYY/g, 'iYYYY')
      const hijri = moment(value).format(pattern)
      //console.log(value, pattern);
      //console.log(toHijri(new Date(value)).ignoreTime());
      return hijri
    }
  }

  constructor(
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) {
    this.datePipe = new DatePipe(locale)
  }
}
