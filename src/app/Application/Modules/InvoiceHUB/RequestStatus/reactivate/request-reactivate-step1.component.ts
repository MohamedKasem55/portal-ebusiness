import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { FormBuilder, NgModel } from '@angular/forms'

import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component implements OnInit, OnDestroy {
  @Input() batch: any
  @Input() accounts: any
  @Output() onInit = new EventEmitter<Component>()

  @ViewChild('pay') pay: NgModel
  //@ViewChild('selectedAccount') selectedAccount:NgModel;

  selected: any

  valid() {
    return this.pay.isDisabled || this.pay.valid
  }

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
  ) {}

  ngOnInit() {
    this.selected = this.getAccountKeyByAccountNumber(this.batch.accountNumber)
    //console.log(this.batch.accountNumber);
    //console.log(this.selected);
    this.onInit.emit(this as Component)
  }

  changeAccount(event) {
    this.batch.accountNumber = this.getAccountByKey(
      this.selected,
    ).fullAccountNumber
  }

  getAccountByKey(i) {
    for (let k = 0; k < this.accounts.length; ++k) {
      if (this.accounts[k].key == i) {
        return this.accounts[k].value
      }
    }
    return null
  }

  getAccountKeyByAccountNumber(i) {
    for (let k = 0; k < this.accounts.length; ++k) {
      //console.log('full account',this.accounts[k].value.fullAccountNumber,i);
      if (this.accounts[k].value.fullAccountNumber == i) {
        return this.accounts[k].key
      }
    }
    return null
  }

  ngOnDestroy() {}
}
