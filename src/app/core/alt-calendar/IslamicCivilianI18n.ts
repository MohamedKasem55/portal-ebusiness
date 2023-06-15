import { Injectable } from '@angular/core'
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'

export const i18nCONF = {
  ar: {
    WEEKDAYS_SHORT: ['إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت', 'أحد'],
    MONTHS_SHORT: [
      'مُحَرَّم',
      'صَفَر',
      'رَبيع الأوّل',
      'رَبيع الثاني',
      'جُمادى الأولى',
      'جُمادى الآخرة',
      'رَجَب',
      'شَعْبان',
      'رَمَضان',
      'شَوّال',
      'ذو القعدة',
      'ذو الحجة',
    ],
    MONTHS_FULL: [
      'مُحَرَّم',
      'صَفَر',
      'رَبيع الأوّل',
      'رَبيع الثاني',
      'جُمادى الأولى',
      'جُمادى الآخرة',
      'رَجَب',
      'شَعْبان',
      'رَمَضان',
      'شَوّال',
      'ذو القعدة',
      'ذو الحجة',
    ],
  },
  en: {
    WEEKDAYS_SHORT: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
    MONTHS_SHORT: [
      'Muh.',
      'Saf.',
      'Rab. I',
      'Rab. II',
      'Jum. I',
      'Jum. II',
      'Raj.',
      'Sha.',
      'Ram.',
      'Shaw.',
      'Dhuʻl-Q.',
      'Dhuʻl-H.',
    ],
    MONTHS_FULL: [
      'Muharram',
      'Safar',
      'Rabī‘ al-awwal',
      'Rabī‘ ath-thānī',
      'Jumada I',
      'Jumada II',
      'Rajab',
      'Sha‘bān',
      'Ramadan',
      'Shawwal',
      'Dhū al-Ḥijjah',
      'Dhū al-Ḥijjah',
    ],
  },
}

@Injectable()
export class IslamicCivilI18n extends NgbDatepickerI18n {
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
    return i18nCONF[this.currentLang]['WEEKDAYS_SHORT'][weekday - 1]
  }

  getMonthShortName(month: number) {
    return i18nCONF[this.currentLang]['MONTHS_SHORT'][month - 1]
  }

  getMonthFullName(month: number) {
    return i18nCONF[this.currentLang]['MONTHS_FULL'][month - 1]
  }
}
