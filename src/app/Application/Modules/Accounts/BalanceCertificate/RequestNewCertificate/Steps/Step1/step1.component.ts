import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { Subscription } from 'rxjs'
import { AccountsList } from '../../../../Services/accounts-list-data.service'

@Component({
  selector: 'app-add-balance-certificate-step1',
  templateUrl: './step1.component.html',
})
export class Step1Component implements OnInit, OnDestroy {
  @ViewChild('balanceCertificateRequest', { static: true }) form: any
  @Input() model: any
  @Input() cities: any
  @Input() accounts: any
  @Output() onInit = new EventEmitter<Component>()

  subscriptions: Subscription[] = []
  accountFrom: any
  accountList

  constructor(public listService: AccountsList) {}

  ngOnInit() {
    this.onInit.emit(this as Component)
    this.listService.getAccountsInquiry().subscribe((data) => {
      this.accountFrom = this.extractAccountKeyValue(data.listAccount)
    })
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  canShowSelectPlaceHolder(field) {
    if (field == null) {
      return true
    }
  }
}
