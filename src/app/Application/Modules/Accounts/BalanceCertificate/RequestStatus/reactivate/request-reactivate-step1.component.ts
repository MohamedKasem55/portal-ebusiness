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
import { LangChangeEvent, TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { StaticService } from '../../../../Common/Services/static.service'
import { RequestReactivateService } from './request-reactivate.service'

@Component({
  selector: 'app-request-reactivate-step1',
  templateUrl: './request-reactivate-step1.component.html',
  styleUrls: ['./request-reactivate.component.scss'],
})
export class RequestReactivateStep1Component implements OnInit, OnDestroy {
  @Input() batch: any
  @Output() onInit = new EventEmitter<Component>()
  @ViewChild('company') companyModel: NgModel
  @ViewChild('city') cityModel: NgModel
  @ViewChild('selectedAccount') accountModel: NgModel
  @ViewChild('postalCode') postalCodeModel: NgModel

  accounts: any
  cities: any = []
  subscriptions: any = []
  selected: any

  valid(): boolean {
    return (
      this.companyModel.valid &&
      this.cityModel.valid &&
      this.accountModel.valid &&
      this.postalCodeModel.valid
    )
  }

  constructor(
    private fb: FormBuilder,
    public service: RequestReactivateService,
    public translate: TranslateService,
    public staticService: StaticService,
  ) {}

  refreshData() {
    const combosSolicitados = ['cityType']
    this.staticService
      .getAllCombos(combosSolicitados)
      .subscribe((comboData) => {
        const data: Object = comboData
        //console.log(data[combosSolicitados.indexOf("cityType")]);
        this.cities = []
        const index = Object.keys(
          data[combosSolicitados.indexOf('cityType')]['values'],
        ).sort((a, b) => {
          //console.log(a,b);
          return data[combosSolicitados.indexOf('cityType')]['values'][a] >
            data[combosSolicitados.indexOf('cityType')]['values'][b]
            ? 1
            : data[combosSolicitados.indexOf('cityType')]['values'][b] >
              data[combosSolicitados.indexOf('cityType')]['values'][a]
            ? -1
            : 0
        })
        for (let i = 0; i < index.length; i++) {
          this.cities.push({
            key: index[i],
            value:
              data[combosSolicitados.indexOf('cityType')]['values'][index[i]],
          })
        }
      })
  }

  ngOnInit() {
    this.refreshData()
    this.subscriptions.push(
      this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
        this.refreshData()
      }),
    )
    this.subscriptions.push(
      this.service.init().subscribe((result) => {
        this.accounts = this.extractAccountKeyValue(result.accountList)

        this.selectedAccount()
      }),
    )
    this.onInit.emit(this as Component)
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
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

  selectedAccount() {
    for (let k = 0; k < this.accounts.length; ++k) {
      if (
        this.accounts[k].value.fullAccountNumber == this.batch.accountNumber
      ) {
        this.selected = this.accounts[k].key
      }
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }
}
