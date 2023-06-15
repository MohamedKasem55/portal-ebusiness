import { Injectable } from '@angular/core'
import {
  NgbCalendar,
  NgbCalendarGregorian,
  NgbCalendarIslamicCivil,
  NgbDatepickerI18n,
} from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { GregorianI18n } from './GregorianI18n'
import { IslamicCivilI18n } from './IslamicCivilianI18n'

export enum Calendars {
  gregorian = 1,
  islamic = 2,
}

@Injectable()
export class CalendarService {
  calendarType: Calendars = Calendars.gregorian

  islamicCalendar: NgbCalendarIslamicCivil
  i18nIslamicCalendar: IslamicCivilI18n
  gregorianCalendar: NgbCalendarGregorian
  i18nGregorianCalendar: GregorianI18n

  constructor(translate: TranslateService) {
    this.islamicCalendar = new NgbCalendarIslamicCivil()
    this.gregorianCalendar = new NgbCalendarGregorian()
    this.i18nIslamicCalendar = new IslamicCivilI18n(translate)
    this.i18nGregorianCalendar = new GregorianI18n(translate)
  }

  getCalendarType(): Calendars {
    return this.calendarType
  }

  setCalendarType(type: Calendars) {
    this.calendarType = type
  }

  getIslamicCalendar(): NgbCalendarIslamicCivil {
    return this.islamicCalendar
  }

  getGregorianCalendar(): NgbCalendarGregorian {
    return this.gregorianCalendar
  }

  getI18nIslamicCalendar(): IslamicCivilI18n {
    return this.i18nIslamicCalendar
  }

  getI18nGregorianCalendar(): GregorianI18n {
    return this.i18nGregorianCalendar
  }

  getCalendar(): NgbCalendar {
    switch (this.calendarType) {
      case Calendars.gregorian:
        return this.getGregorianCalendar()
        break
      case Calendars.islamic:
        return this.getIslamicCalendar()
        break
    }
  }

  getI18nCalendar(): NgbDatepickerI18n {
    switch (this.calendarType) {
      case Calendars.gregorian:
        return this.getI18nGregorianCalendar()
        break
      case Calendars.islamic:
        return this.getI18nIslamicCalendar()
        break
    }
  }
}
