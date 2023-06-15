import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { BeneficiaryListService } from './beneficiary-list.service'
import { DetailComponent } from './components/details/detail.component'
import { NewPaymentComponent } from './components/payment/new-payment.component'

@Component({
  selector: 'app-beneficiary',
  templateUrl: './beneficiary.component.html',
  styleUrls: ['./beneficiary.component.scss'],
})
export class BeneficiaryComponent implements OnInit {
  sharedData: any = {}
  subscriptions: Subscription[] = []

  currentComponent: any

  constructor(
    private service: BeneficiaryListService,
    public translate: TranslateService,
    public router: Router,
  ) {}

  componentAdded(component) {
    this.currentComponent = component
    component.sharedData = this.sharedData
    if (component instanceof NewPaymentComponent) {
      ;(<NewPaymentComponent>component).createForm(this.sharedData.payments)
    }
    if (component instanceof DetailComponent) {
      ;(<DetailComponent>component).setPage(null)
    }
  }

  ngOnInit() {
    this.sharedData.searchCriteria = {
      passNumber: null,
      name: null,
      createDateTo: null,
      createDateFrom: null,
    }
    this.sharedData.details = {}
    this.sharedData.tableSelectedRows = []
  }
}
