import { DatePipe } from '@angular/common'
import {
  Component,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnChanges,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { ModelService } from '../../../Components/common/model.service'
import { AmountCurrencyPipe } from '../../../Components/common/Pipes/amount-currency.pipe'
import { Company } from '../../../Model/company'
import { User } from '../../../Model/user'
import { Welcome } from '../../../Model/welcome'
import { TableRow } from './utils/table-row.interface'
import { DateFormatPipe } from '../../../Components/common/Pipes/date-format-pipe'

@Component({
  templateUrl: 'information.component.html',
  selector: 'app-information',
  styleUrls: ['information.component.scss'],
})
export class InformationComponent implements OnChanges {
  @Input() storedSession
  @Input() storedWelcome: Welcome

  public userDataTable: TableRow[]
  public limitsDataTable: TableRow[]
  public smsDataTable: TableRow[]
  public result: []

  constructor(
    public _authService: AuthenticationService,
    @Inject(LOCALE_ID) private _locale: string,
    private injector: Injector,
    public translate: TranslateService,
  ) {
    const call = this.injector
      .get(ModelService)
      .getModel(this.translate.currentLang, 'errors')
    if (call instanceof Observable) {
      call.subscribe((_result) => {
        this.result = _result
        if (typeof this.storedSession != 'undefined') {
          this.userDataTable = this._mapUserDataToTableModel(
            this.storedSession,
            this.storedWelcome,
          )
        }
      })
    } else {
      this.result = call
      if (typeof this.storedSession != 'undefined') {
        this.userDataTable = this._mapUserDataToTableModel(
          this.storedSession,
          this.storedWelcome,
        )
      }
    }
  }

  public ngOnChanges() {
    this.userDataTable = this._mapUserDataToTableModel(
      this.storedSession,
      this.storedWelcome,
    )
    this.limitsDataTable = this._mapLimitsDataToTableModel(
      this.storedSession,
      this.storedWelcome,
    )
    this.smsDataTable = this._mapSmsDataToTableModel(
      this.storedSession,
      this.storedWelcome,
    )
  }

  private _mapUserDataToTableModel(
    storedSession: any,
    storedWelcome: any,
  ): TableRow[] {
    const storedCompany: Company = storedSession?.company
    const storedUser: User = storedSession?.user
    const userInformation: TableRow[] = [
      {
        name: 'welcome.companyNameLbl',
        value: storedCompany.companyName,
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.userIdLbl',
        value: storedUser.userId,
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.userNameLbl',
        value: storedUser.userName,
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.lastLogonStatusLbl',
        value: this.getErrorValue('errorTable.' + storedCompany.lastReturnCode),
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.lastLogonDateTimeLbl',
        value: new DateFormatPipe(
          this.injector,
          this.translate.currentLang,
        ).transform(storedUser.lastLogon, 'yyyy-MM-dd HH:mm:ss'),
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.limitCICLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.limitCIC ? storedWelcome.limitCIC : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, null),
      },
    ]

    return userInformation
  }

  private _mapLimitsDataToTableModel(
    storedSession: any,
    storedWelcome: Welcome,
  ): TableRow[] {
    const limitsInformation: TableRow[] = [
      {
        name: 'welcome.userDailyTransferLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.userDailyTransferLimit
            ? storedWelcome.userDailyTransferLimit
            : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['TfGroup']),
      },
      {
        name: 'welcome.limitUtilizedLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.limitUtilized ? storedWelcome.limitUtilized : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.ownLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.ownLimit ? storedWelcome.ownLimit : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['TfOwnGroup']),
      },
      {
        name: 'welcome.withinLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.withinLimit ? storedWelcome.withinLimit : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['TfGroup']),
      },
      {
        name: 'welcome.localLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.localLimit ? storedWelcome.localLimit : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['TfLocalGroup']),
      },
      {
        name: 'welcome.internationalLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.internationalLimit
            ? storedWelcome.internationalLimit
            : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['TfRemGroup']),
      },
      {
        name: 'welcome.remainingDailyTransferLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.dailyTransferLimitRemaining
            ? storedWelcome.dailyTransferLimitRemaining
            : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.remainingBillPaymentLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.billPaymentRemaining
            ? storedWelcome.billPaymentRemaining
            : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['BillPayGroup']),
      },
      {
        name: 'welcome.remainingSadadInvoiceHubLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.sadadInvoiceHubRemaining
            ? storedWelcome.sadadInvoiceHubRemaining
            : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['SadadInvoiceHubGroup']),
      },
      {
        name: 'welcome.remainingGovernmentPaymentLimitLbl',
        value: new AmountCurrencyPipe(this.injector, this._locale).transform(
          storedWelcome.govermentPaymentRemaining
            ? storedWelcome.govermentPaymentRemaining
            : 0,
          null,
        ),
        haveToShow: this._haveToShow(null, ['EgovGroup']),
      },
    ]

    return limitsInformation
  }

  private _mapSmsDataToTableModel(
    storedSession: any,
    storedWelcome: Welcome,
  ): TableRow[] {
    const smsInformation: TableRow[] = [
      {
        name: 'welcome.allowedNumSMS',
        value: storedWelcome.alertMaxLimit.toString(),
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.remainingSMS',
        value: storedWelcome.utilizedUserSMS.toString(),
        haveToShow: this._haveToShow(null, null),
      },
      {
        name: 'welcome.expiriDateSMS',
        value: this._setSlashIfNullField(storedWelcome.alertExpirationDate),
        haveToShow: this._haveToShow(null, null),
      },
    ]
    return smsInformation
  }

  private _setSlashIfNullField(field: string): string {
    return field ? field : '-'
  }

  private _haveToShow(privilege: string[], listGroup: string[]): boolean {
    if (privilege === null && listGroup === null) {
      return true
    }
    return this._authService.activateOptionWithoutService(privilege, listGroup)
  }

  public getErrorValue(key) {
    if (typeof this.result != 'undefined') {
      return this.injector.get(ModelService).retrieveValue(this.result, key)
    } else {
      return ''
    }
  }

  public getTitleToUpperCase(strTranslation: string) {
    return this.translate.instant(strTranslation).toUpperCase()
  }
}
