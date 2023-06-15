import { KeyValue } from '@angular/common'
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { Subscription } from 'rxjs'
import { AccountsList } from '../../../Services/accounts-list-data.service'
import {
  AccountComboList,
  RequestAccountsList,
  RequestStaticList,
  StaticsModelDTO,
} from '../../request-statement-models'
import { RequestStatementService } from '../../request-statement.service'

interface Combo {
  id: string
  text: string
}

@Component({
  selector: 'app-request-statement-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit, OnDestroy {
  @ViewChild('f') formulario: any
  fromDate = new Date()
  toDate = new Date()
  bsConfig: any

  amountRangeFrom: number
  amountRangeTo: number

  comboData: Combo[]
  selectedAccount: string

  languages: KeyValue<string, string>[] = [
    { key: 'en', value: 'English' },
    { key: 'ar', value: 'Arabic' },
  ]
  selectedLanguage: string
  types: KeyValue<string, string>[] = [
    { key: 'X', value: 'Excel' },
    { key: 'P', value: 'Pdf' },
  ]
  selectedType: string
  disableButton: boolean
  checkdesable = []
  transactions = '0'

  filtersList: Combo[] = [] // lista de filtros bbdd
  selectedFiltersList: Combo[] = [] // lista de filtros seleccionados
  selectedFiltersAdd: string[] = [] // ngModel
  selectedFiltersQuit: string[] = [] // ngModel
  orderFilters: string[] = []
  subscriptions: Subscription[] = []
  today = new Date()
  accountFrom: any
  account
  @Output() onInit = new EventEmitter<Component>()

  constructor(
    public rsService: RequestStatementService,
    public listService: AccountsList,
    private translateService: TranslateService,
  ) {
    this.accountFrom = []
  }

  ngOnInit(): void {
    this.listService.getAccountsList().subscribe((data) => {
      this.accountFrom = this.extractAccountKeyValue(data.listAccount)
    })
    this.bsConfig = Object.assign(
      {},
      {
        showWeekNumbers: false,
        adaptivePosition: true,
        dateInputFormat: 'DD/MM/YYYY',
        containerClass: 'theme-dark-blue',
      },
    )
    this.getCombo()
    this.getFilterBy()
    this.selectedType = 'X'
    this.selectedLanguage = this.translateService.currentLang
    this.onInit.emit(this as Component)
  }

  extractAccountKeyValue(account: any) {
    const accountKeyValue = []
    for (let i = 0; account.length > i; i++) {
      accountKeyValue.push({ key: i, value: account[i] })
    }
    return accountKeyValue
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  clickAdd(selected) {
    for (let value of selected) {
      if (value === '000') {
        this.selectedFiltersList = []
        this.disableButton = true
      }
    }
    if (this.selectedFiltersList.length < 5) {
      selected.forEach((item: string) => {
        // if(selected[0] == '000'){
        //   if (!this.selectedFiltersList.find((finded) => finded.id === item)) {
        //     const combo = this.findInCombo(item);
        //     if (typeof combo !== 'undefined') {

        //         for(let value of this.filtersList){
        //             this.selectedFiltersList.push(value);
        //         }
        //         this.filtersList = [];
        //     }
        //   }
        // }
        if (!this.selectedFiltersList.find((finded) => finded.id === item)) {
          const combo = this.findInCombo(item)
          if (typeof combo !== 'undefined') {
            this.selectedFiltersList.push(combo)
          }
        }
      })
      selected.forEach((item: string) => {
        const index2 = this.filtersList.findIndex((data) => data.id == item)
        this.filtersList.splice(index2, selected.length)
      })
    } else {
      this.disableButton = true
    }
  }

  clickQuit(selected: string[]) {
    this.disableButton = false
    selected.forEach((item: string) => {
      // if(item == '000'){
      //         for(let value of this.selectedFiltersList){
      //             this.filtersList.push(value);
      //         }
      //             this.selectedFiltersList = [];
      // } else {
      this.selectedFiltersList.forEach((item2: Combo, index) => {
        if (item === item2.id) {
          this.filtersList.push(this.selectedFiltersList[index])
          this.selectedFiltersList.splice(index, 1)
        }
      })
      //}
    })
  }

  getSelectedValue() {
    if (this.selectedFiltersList.length >= 5) {
      this.disableButton = true
    } else {
      for (let value of this.selectedFiltersAdd) {
        if (value == '000') {
          //console.log("all");
        }
      }
    }
  }

  findInCombo(id: string) {
    return this.filtersList.find((item: Combo) => item.id === id)
  }

  getCombo() {
    let datos: AccountComboList[]
    this.comboData = []

    const body: RequestAccountsList = {
      order: '',
      orderType: '',
      page: 1,
      rows: 20,
      txType: 'ECIA',
    }

    this.rsService.getAccountCombo(body).subscribe((response: any) => {
      datos = response.listAccount
      let i = 0
      datos.map((dato: any) => {
        const comboItem: any = {
          id: i + '',
          text: dato.fullAccountNumber,
          name: dato['alias'],
        }
        this.comboData.push(comboItem)
        //console.log(this.comboData);
      })
    })
  }

  getFilterBy() {
    this.orderFilters = []
    this.filtersList = []

    const body: RequestStaticList = {
      names: ['filterType'],
    }

    this.rsService
      .getFilterByCombo(body)
      .subscribe((response: StaticsModelDTO) => {
        this.orderFilters = response[0].props.order.split(',')
        this.orderFilters.forEach((order) => {
          const comboItem: Combo = {
            id: order,
            text: response[0].props[order],
          }
          this.filtersList.push(comboItem)
        })
      })
  }

  getMaxDateToday(date) {
    return date ? date : this.today
  }

  amountValid(): boolean {
    // if (!this.amountRangeFrom || !this.amountRangeTo) { return true; }
    // return this.amountRangeFrom * 1 < this.amountRangeTo * 1;
    return this.rsService.amountValidCheck(
      this.amountRangeFrom,
      this.amountRangeTo,
    )
  }
}
