import { Injectable } from '@angular/core'
import { NgbCalendar, NgbDate, NgbPeriod } from '@ng-bootstrap/ng-bootstrap'
import { CalendarService } from './calendar.service'
@Injectable()
export class NgbStrategyCalendar implements NgbCalendar {
  constructor(public calendarService: CalendarService) {}

  getDaysPerWeek(): number {
    return this.calendarService.getCalendar().getDaysPerWeek()
  }

  /**
   * Returns an array of months per year.
   *
   * With default calendar we use ISO 8601 and return [1, 2, ..., 12];
   */
  getMonths(year?: number): number[] {
    return this.calendarService.getCalendar().getMonths(year)
  }

  /**
   * Returns the number of weeks per month.
   */
  getWeeksPerMonth(): number {
    return this.calendarService.getCalendar().getWeeksPerMonth()
  }

  /**
   * Returns the weekday number for a given day.
   *
   * With the default calendar we use ISO 8601: 'weekday' is 1=Mon ... 7=Sun
   */
  getWeekday(date: NgbDate): number {
    return this.calendarService.getCalendar().getWeekday(date)
  }

  /**
   * Adds a number of years, months or days to a given date.
   *
   * * `period` can be `y`, `m` or `d` and defaults to day.
   * * `number` defaults to 1.
   *
   * Always returns a new date.
   */
  getNext(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate {
    return this.calendarService.getCalendar().getNext(date, period, number)
  }

  /**
   * Subtracts a number of years, months or days from a given date.
   *
   * * `period` can be `y`, `m` or `d` and defaults to day.
   * * `number` defaults to 1.
   *
   * Always returns a new date.
   */
  getPrev(date: NgbDate, period?: NgbPeriod, number?: number): NgbDate {
    return this.calendarService.getCalendar().getPrev(date, period, number)
  }

  /**
   * Returns the week number for a given week.
   */
  getWeekNumber(week: NgbDate[], firstDayOfWeek: number): number {
    return this.calendarService
      .getCalendar()
      .getWeekNumber(week, firstDayOfWeek)
  }

  /**
   * Returns the today's date.
   */
  getToday(): NgbDate {
    return this.calendarService.getCalendar().getToday()
  }

  /**
   * Checks if a date is valid in the current calendar.
   */
  isValid(date: NgbDate): boolean {
    return this.calendarService.getCalendar().isValid(date)
  }
}
