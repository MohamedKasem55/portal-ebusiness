import { Injectable } from '@angular/core'
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

export const GregorianI18nCONF = {
  ar: {
    WEEKDAYS_SHORT: ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد'],
    MONTHS_SHORT: [
      'يناير',
      'فبراير',
      'مارس',
      'ابريل',
      'مايو',
      'يونيو',
      'يوليو',
      'اغسطس',
      'سبتمبر',
      'اكتوبر',
      'نوفمبر',
      'ديسمبر',
    ],
    MONTHS_FULL: [
      'يناير',
      'فبراير',
      'مارس',
      'ابريل',
      'مايو',
      'يونيو',
      'يوليو',
      'اغسطس',
      'سبتمبر',
      'اكتوبر',
      'نوفمبر',
      'ديسمبر',
    ],
  },
  en: {
    WEEKDAYS_SHORT: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    MONTHS_SHORT: [
      'Jan.',
      'Feb.',
      'Mar.',
      'Apr.',
      'May.',
      'June.',
      'July.',
      'Aug.',
      'Sept.',
      'Oct.',
      'Nov.',
      'Dec.',
    ],
    MONTHS_FULL: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
  },
}

@Injectable()
export class GregorianI18n extends NgbDatepickerI18n {
  currentLang: any = ''

  constructor(translateService: TranslateService) {
    super()
    this.currentLang = translateService.currentLang
    translateService.onLangChange.subscribe((event: LangChangeEvent) => {
      this.currentLang = event.lang
    })
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.day}-${date.month}-${date.year}`
  }

  getWeekdayShortName(weekday: number) {
    return GregorianI18nCONF[this.currentLang]['WEEKDAYS_SHORT'][weekday - 1]
  }

  getMonthShortName(month: number) {
    return GregorianI18nCONF[this.currentLang]['MONTHS_SHORT'][month - 1]
  }

  getMonthFullName(month: number) {
    return GregorianI18nCONF[this.currentLang]['MONTHS_FULL'][month - 1]
  }
}
