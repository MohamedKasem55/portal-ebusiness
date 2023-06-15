import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { Exception } from '../../../../../Model/exception'
import { BeneficiaryListService } from './../../beneficiary-list.service'

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss'],
})
export class DeleteComponent implements OnInit, OnDestroy {
  sharedData: any = {}
  subscriptions: Subscription[] = []

  step = 'delete'

  confirm = false

  constructor(
    private service: BeneficiaryListService,
    public translate: TranslateService,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.confirm = false
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  removeBeneficiary(value) {
    this.sharedData.deleted.splice(value, 1)
    if (this.sharedData.deleted.length == 0) {
      this.router.navigate(['/aramcoPayments/beneficiaries'])
    }
  }

  proceed() {
    this.subscriptions.push(
      this.service.delete(this.sharedData.deleted).subscribe((result) => {
        if (result instanceof Exception) {
          return
        } else {
          this.confirm = true
        }
      }),
    )
  }

  finish() {
    this.sharedData.tableSelectedRows = []
    this.sharedData.deleted = []
    this.sharedData.details = {}
    this.sharedData.payments = []
    this.router.navigate(['/aramcoPayments/beneficiaries'])
  }
}
