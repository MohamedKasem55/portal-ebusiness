import { Injectable } from '@angular/core'
import { NgbDatepickerI18n, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap'
import { CalendarService } from './calendar.service'

@Injectable()
export class NgbStrategyI18nCalendar extends NgbDatepickerI18n {
  currentLang: any = ''

  constructor(public calendarService: CalendarService) {
    super()
  }

  /**
   * Returns the short weekday name to display in the heading of the month view.
   *
   * With default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun.
   */
  getWeekdayShortName(weekday: number): string {
    return this.calendarService.getI18nCalendar().getWeekdayShortName(weekday)
  }

  /**
   * Returns the short month name to display in the date picker navigation.
   *
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   */
  getMonthShortName(month: number, year?: number): string {
    return this.calendarService.getI18nCalendar().getMonthShortName(month, year)
  }

  /**
   * Returns the full month name to display in the date picker navigation.
   *
   * With default calendar we use ISO 8601: 'month' is 1=Jan ... 12=Dec.
   */
  getMonthFullName(month: number, year?: number): string {
    return this.calendarService.getI18nCalendar().getMonthFullName(month, year)
  }

  /**
   * Returns the value of the `aria-label` attribute for a specific date.
   *
   * @since 2.0.0
   */
  getDayAriaLabel(date: NgbDateStruct): string {
    return this.calendarService.getI18nCalendar().getDayAriaLabel(date)
  }

  /**
   * Returns the textual representation of a day that is rendered in a day cell.
   *
   * @since 3.0.0
   */
  getDayNumerals(date: NgbDateStruct): string {
    return this.calendarService.getI18nCalendar().getDayNumerals(date)
  }

  /**
   * Returns the textual representation of a week number rendered by datepicker.
   *
   * @since 3.0.0
   */
  getWeekNumerals(weekNumber: number): string {
    return this.calendarService.getI18nCalendar().getWeekNumerals(weekNumber)
  }

  /**
   * Returns the textual representation of a year that is rendered in the datepicker year select box.
   *
   * @since 3.0.0
   */
  getYearNumerals(year: number): string {
    return this.calendarService.getI18nCalendar().getYearNumerals(year)
  }
}
