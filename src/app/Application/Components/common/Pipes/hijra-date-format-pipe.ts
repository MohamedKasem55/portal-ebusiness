import { Injector, Pipe, PipeTransform } from '@angular/core'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

// tslint:disable-next-line:no-var-requires
const moment = require('moment-hijri')

@Pipe({ name: 'hijraDateFormat', pure: false })
export class HijraDateFormatPipe implements PipeTransform {
  transform(value: any, pattern: string): string | null {
    let locale = this.injector.get(TranslateService).currentLang
    this.injector
      .get(TranslateService)
      .onLangChange.subscribe((event: LangChangeEvent) => {
        //console.log(event);
        locale = event.lang
        //console.log (this.injector.get(TranslateService).currentLang);
      })
    if (!value || value == '') {
      return ''
    }

    const hijri = moment(value)
    //	console.log (locale);
    if (locale.indexOf('en') > -1) {
      hijri.locale('en')
    } else {
      hijri.locale('ar')
    }
    pattern = pattern.toUpperCase()
    pattern = pattern.replace(/MM/g, 'iMM')
    pattern = pattern.replace(/DD/g, 'iDD')
    pattern = pattern.replace(/YYYY/g, 'iYYYY')

    //console.log(opts);
    const formatted = hijri.format(pattern)

    if (!formatted || formatted.indexOf('NaN') != -1) {
      return this.injector
        .get(TranslateService)
        .instant('public.hijraDateUnavailable')
    }

    return formatted
  }

  constructor(private injector: Injector) {}
}
