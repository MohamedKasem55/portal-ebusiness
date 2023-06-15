import { DecimalPipe } from '@angular/common'
import {
  Component,
  EventEmitter,
  Inject,
  Input,
  LOCALE_ID,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { AddPositivePayService } from './add-positive-pay.service'

@Component({
  selector: 'app-positive-step1',
  templateUrl: './add-positive-pay-step1.component.html',
})
export class AddPositivePayStep1Component implements OnInit, OnDestroy {
  @Input() form: FormGroup
  @Output() onInit = new EventEmitter<Component>()

  mensajeError: any = {}
  subscriptions: Subscription[] = []
  bsConfig: any
  accounts: any
  addPositiveRows: any[] = []

  constructor(
    private fb: FormBuilder,
    public translate: TranslateService,
    public service: AddPositivePayService,
    @Inject(LOCALE_ID) private locale: string,
  ) {}

  getAccounts() {
    this.subscriptions.push(
      this.service.getAccounts().subscribe((result: any) => {
        if (result instanceof Exception) {
          this.onError(result)
          return
        } else {
          this.accounts = result
        }
      }),
    )
  }

  ngOnInit() {
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        containerClass: 'theme-dark-blue',
        dateInputFormat: 'DD/MM/YYYY',
      },
    )
    this.getAccounts()
    this.onInit.emit(this as Component)
  }

  setPage(pageInfo) {
    if (pageInfo == null) {
      pageInfo = { offset: 0 }
    }
  }
  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  focusOutAmount(value): void {
    try {
      if (value) {
        const decimalPipe = new DecimalPipe(this.locale)
        this.form
          .get('amount')
          .setValue(
            decimalPipe.transform(value.value, '1.2-6').replace(/,/g, ''),
          )
      }
    } catch (e) {
      this.form.get('amount').setValue('')
    }
  }
}
