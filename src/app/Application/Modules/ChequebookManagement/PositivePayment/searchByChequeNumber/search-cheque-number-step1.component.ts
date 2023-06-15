import { DecimalPipe } from '@angular/common'
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '../../../../../../../node_modules/@ngx-translate/core'
import { SearchByChequeNumberService } from './search-cheque-number.service'

@Component({
  selector: 'app-search-cheque-number-step1',
  templateUrl: 'search-cheque-number-step1.component.html',
})
export class SearchByChequeNumberStep1Component implements OnInit {
  @Input() form: FormGroup
  @Input() chequeSelected: any
  @Output() onInit = new EventEmitter<Component>()

  mensajeError: any = {}

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    public service: SearchByChequeNumberService,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    const decimalPipe = new DecimalPipe(this.locale)
    const ammount: number =
      this.chequeSelected.positivePayCheckAccountsOutDTO[0].amount
    const noSeparator = decimalPipe.transform(ammount, '1.2-2')
    this.chequeSelected.positivePayCheckAccountsOutDTO[0].amount =
      noSeparator.replace(/,/g, '')
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
