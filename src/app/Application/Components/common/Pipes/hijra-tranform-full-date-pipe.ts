import { Inject, Injector, LOCALE_ID, Pipe, PipeTransform } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'

// tslint:disable-next-line:no-var-requires
const moment = require('moment-hijri')

@Pipe({ name: 'hijraFullDateTransform', pure: false })
export class HijraFullDateTransformPipe implements PipeTransform {
  date = ''

  transform(value: any, pattern: string): string | null {
    if (!value || value == '') {
      return ''
    }

    let hijri
    pattern = pattern.toUpperCase()
    pattern = pattern.replace(/MM/g, 'iMM')
    pattern = pattern.replace(/DD/g, 'iDD')
    pattern = pattern.replace(/YYYY/g, 'iYYYY')
    moment.locale(this.injector.get(TranslateService).currentLang)
    hijri = moment(value).format(pattern)

    return hijri
  }

  constructor(
    private injector: Injector,
    @Inject(LOCALE_ID) private locale: string,
  ) {}
}
