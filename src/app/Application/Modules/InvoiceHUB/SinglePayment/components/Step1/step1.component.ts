import { Component, OnInit } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { SinglePaymentService } from '../../single-payment.service'

@Component({
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit {
  step = 1
  sharedData: any = {}

  constructor(
    private service: SinglePaymentService,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    //borrar cuando haya servicios
  }

  valid() {
    return (
      this.sharedData['invoiceId'] && this.sharedData['invoiceId'].length == 12
    )
  }
}
