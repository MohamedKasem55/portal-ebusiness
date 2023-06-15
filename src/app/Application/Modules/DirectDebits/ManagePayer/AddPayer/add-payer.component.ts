import { Component, OnDestroy, OnInit } from '@angular/core'
import { FormBuilder, FormGroup, FormArray } from '@angular/forms'
import { Router } from '@angular/router'
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription, interval } from 'rxjs'
import { Exception } from '../../../../Model/exception'
import { Page } from '../../../../Model/page'
import { PagedData } from '../../../../Model/paged-data'
import { ManagePayerService } from '../manage-payer.service'
import { PayerShareService } from '../payer-share.service'
import { StaticService } from '../../../Common/Services/static.service'
import { PendingActionsNotificaterService } from '../../../Common/Components/PendingActions/pending-actions-notificater.service'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy'

@UntilDestroy()
@Component({
  selector: 'app-add-payer',
  templateUrl: './add-payer.component.html',
  styleUrls: ['./add-payer.component.scss'],
})
export class AddPayerComponent implements OnInit, OnDestroy {
  step: number
  form: FormGroup

  banks: any
  banksCodes: any
  listPage: PagedData<any>
  validData: any

  combosSolicitados: string[] = ['directDebitBankCode', 'bankCodeConversion']

  mensajeError: any = {}
  subscriptions: Subscription[] = []

  constructor(
    fb: FormBuilder,
    public staticService: StaticService,
    public service: ManagePayerService,
    private router: Router,
    public shareService: PayerShareService,
    public translate: TranslateService,
    public pendingActionNotification: PendingActionsNotificaterService,
  ) {
    this.step = 1
    this.shareService.clearDataInit()
    this.form = fb.group({
      elements: fb.array([]),
    })
    this.listPage = new PagedData<any>()
    const page = new Page()
    page.pageNumber = 1
    page.pageSize = 50
    this.listPage.page = page
  }

  ngOnInit() {
    interval(1000).pipe(untilDestroyed(this)).subscribe()
    this.refreshData()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
  }

  get elements(): FormGroup[] {
    return this.form.controls['elements']['controls']
  }

  refreshData() {
    this.subscriptions.push(
      this.staticService
        .getAllCombos(this.combosSolicitados)
        .subscribe((result) => {
          const data = result
          this.banks = this.transformToKeyValue(
            data[this.combosSolicitados.indexOf('directDebitBankCode')][
              'values'
            ],
          )
          this.banksCodes = this.transformToKeyValue(
            data[this.combosSolicitados.indexOf('bankCodeConversion')][
              'values'
            ],
          )
        }),
    )
  }

  transformToKeyValue(data) {
    const aux = []
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < Object.keys(data).length; ++i) {
      aux.push({ key: Object.keys(data)[i], value: data[Object.keys(data)[i]] })
    }
    return aux
  }

  next() {
    switch (this.step) {
      case 1:
        this.subscriptions.push(
          this.service
            .valid(
              this.form.value.elements,
              this.listPage.page.pageNumber + 1,
              this.listPage.page.pageSize,
            )
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.validData = result
                this.nextStep()
                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }),
        )
        break
      case 2:
        this.subscriptions.push(
          this.service
            .confirm(
              this.form.value.elements,
              this.listPage.page.pageNumber + 1,
              this.listPage.page.pageSize,
            )
            .subscribe((result) => {
              if (result instanceof Exception) {
                this.onError(result)
                return
              } else {
                this.nextStep()
                this.pendingActionNotification.getRefreshObserver().next(true)
              }
            }),
        )
        break
      case 3:
        this.pendingActionNotification.getRefreshObserver().next(true)
        this.router.navigate(['/direct-debits/manage-payer'])
        break
    }
  }

  nextStep() {
    this.step = ++this.step % 4
    if (this.step === 0) {
      this.step = 1
    }
  }

  previous() {
    this.step = --this.step % 4
    if (this.step === 0) {
      this.step = 1
      this.router.navigate(['/direct-debits/manage-payer'])
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    //console.log(res.error);
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
