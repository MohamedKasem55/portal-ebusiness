import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StorageService } from '../../../../core/storage/storage.service'
import { PositivePaymentService } from './positive-payment.service'

@Component({
  selector: 'app-positive-payment',
  templateUrl: './positive-payment.component.html',
  styleUrls: ['./positive-payment.component.scss'],
})
export class PositivePaymentComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = []
  mensajeError: any = {}

  constructor(
    private router: Router,
    public translate: TranslateService,
    private service: PositivePaymentService,
    public storage: StorageService,
  ) {}

  ngOnInit() {}

  goNewCheque() {
    this.router.navigate([
      '/accounts/chequebook/positive-payment/add-positive-payment',
    ])
  }

  goSearchChequeNumber() {
    this.router.navigate([
      '/accounts/chequebook/positive-payment/search-cheque-number',
    ])
  }

  goHistoricalData() {
    this.router.navigate([
      '/accounts/chequebook/positive-payment/historical-data',
    ])
  }
  goRequestStatus() {
    this.router.navigate([
      '/accounts/chequebook/positive-payment/request-status',
    ])
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  onError(error: any) {
    const res = error
    this.mensajeError['code'] = res.error.errorCode
    this.mensajeError['description'] = res.error.errorDescription
  }
}
