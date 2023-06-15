import {
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
} from '@angular/core'
import {
  NG_ASYNC_VALIDATORS,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
} from '@angular/forms'
import {
  NgbCalendar,
  NgbDateParserFormatter,
  NgbDatepickerI18n,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap'
import { TranslateService } from '@ngx-translate/core'
import { Calendars, CalendarService } from './calendar.service'
import { NgbDateCustomParserFormatter } from './date-custom-parse-formatter'
import { NgbStrategyCalendar } from './ngb-strategy-calendar'
import { NgbStrategyI18nCalendar } from './ngb-strategy-i18nCalendar'
import { ValueAccessorBase } from './value-accessor-base'

export function CalendarFactory(calendarService: CalendarService) {
  return new NgbStrategyCalendar(calendarService)
}

export function i18nFactory(calendarService: CalendarService) {
  return new NgbStrategyI18nCalendar(calendarService)
}

@Component({
  selector: 'arb-calendar',
  templateUrl: './calendar-component.html',
  styleUrls: ['./calendar-component.scss'],
  providers: [
    {
      provide: NgbCalendar,
      useFactory: CalendarFactory,
      deps: [CalendarService],
    },
    {
      provide: NgbDatepickerI18n,
      useFactory: i18nFactory,
      deps: [CalendarService],
    },
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ArbCalendarComponent,
      multi: true,
    },
  ],
})
export class ArbCalendarComponent
  extends ValueAccessorBase<string>
  implements OnInit
{
  @ViewChild('dp', { static: true }) dp: any
  @Input() id: string
  @Input() mindate: boolean
  @Input() maxdate: boolean

  today: NgbDateStruct

  constructor(
    public calendarService: CalendarService,
    public calendar: NgbCalendar,
    @Optional() @Inject(NG_VALIDATORS) private validators: Array<any>,
    @Optional()
    @Inject(NG_ASYNC_VALIDATORS)
    private asyncValidators: Array<any>,
    public translate: TranslateService,
  ) {
    super()
  }

  calendarType() {
    return this.calendarService.getCalendarType() == Calendars.gregorian
  }

  changeCalendarType(event) {
    if (event) {
      this.calendarService.setCalendarType(Calendars.gregorian)
    } else {
      this.calendarService.setCalendarType(Calendars.islamic)
    }
    this.dp.navigateTo(this.calendar.getToday())
  }

  ngOnInit() {
    this.today = this.calendar.getToday()
  }
}
