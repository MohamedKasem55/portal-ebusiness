import { DatePipe } from '@angular/common'
import {
  Component,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  OnInit,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Observable } from 'rxjs'
import { AuthenticationService } from '../../../../core/security/authentication.service'
import { ModelService } from '../../../Components/common/model.service'
import { AmountCurrencyPipe } from '../../../Components/common/Pipes/amount-currency.pipe'
import { Company } from '../../../Model/company'
import { User } from '../../../Model/user'
import { Welcome } from '../../../Model/welcome'

@Component({
  templateUrl: 'commercialCardsHome.component.html',
  selector: 'app-commercialCardsHome',
  styleUrls: ['commercialCardsHome.component.scss'],
})
export class CommercialCardsHomeComponent implements OnInit {
  public userDataTable: any
  public limitsDataTable: any
  public smsDataTable: any
  public result: []

  constructor(
    public _authService: AuthenticationService,
    @Inject(LOCALE_ID) private _locale: string,
    private injector: Injector,
    public translate: TranslateService,
  ) {}
  ngOnInit() {}
}
