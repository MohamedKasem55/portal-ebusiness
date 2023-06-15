import { Component, Inject, Input, OnInit, Optional } from '@angular/core'
import {
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'
import {
  NgbCalendar,
  NgbCalendarIslamicCivil,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap'

import { NgbDateCustomParserFormatter } from './date-custom-parse-formatter'
import { IslamicCivilI18n } from './IslamicCivilianI18n'
import { ValueAccessorBase } from './value-accessor-base'

@Component({
  selector: 'ngbd-datepicker-calendars',
  templateUrl: './datepicker-calendars.html',
  providers: [
    { provide: NgbCalendar, useClass: NgbCalendarIslamicCivil },
    { provide: NgbDatepickerI18n, useClass: IslamicCivilI18n },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: NgbdDatepickerCalendars,
      multi: true,
    },
  ],
})
export class NgbdDatepickerCalendars
  extends ValueAccessorBase<string>
  implements OnInit {
  @Input() id: string
  @Input() mindate: boolean | any
  @Input() maxdate: boolean | any

  today: NgbDateStruct
  todayModel: NgbDateStruct

  date: { year: number; month: number }

  constructor(
    public calendar: NgbCalendar,
    @Optional() @Inject(NG_VALIDATORS) private validators: any[],
    @Optional() @Inject(NG_ASYNC_VALIDATORS) private asyncValidators: any[],
  ) {
    super()
  }

  ngOnInit() {

    this.today = this.calendar.getToday()
  }

  // selectToday() {
  //   this.todayModel = {
  //     year: this.today.year,
  //     month: this.today.month,
  //     day: this.today.day,
  //   }
  // }

  getDateValue(value: any): NgbDateStruct | null {
    if (value === true || value === "true") {
      return this.today;
    }
    if (value === false || value === "false") {
      return null;
    }
    if (value) {
      return value;
    }

    return null;
}
}
