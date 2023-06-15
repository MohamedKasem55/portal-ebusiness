import { isPlatformBrowser } from '@angular/common'
import {
  AfterViewChecked,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { AbstractControl, FormArray, FormGroup } from '@angular/forms'
import { DatatableComponent } from '@swimlane/ngx-datatable'
import { DatatableMobileComponent } from '../../../../../core/responsive/datatable-mobile.component'
import { RevenueAccount } from '../../Model/revenue-account'

@Component({
  selector: 'app-revenue-accounts-table',
  templateUrl: './revenue-accounts-table.component.html',
})
export class RevenueAccountsTableComponent
  extends DatatableMobileComponent
  implements AfterViewChecked, OnInit {
  @ViewChild('table', { static: true }) table: DatatableComponent

  @Input() mainForm: FormGroup
  @Input() subAccountAmounts: FormArray
  @Input() revenueAccounts: RevenueAccount[] = []
  @Input() editView = true
  @Output() removeRow: EventEmitter<number> = new EventEmitter<number>()
  @Output() addRow: EventEmitter<boolean> = new EventEmitter<boolean>()

  innerWidth: any
  mobile: boolean

  constructor(public ref: ChangeDetectorRef) {
    super()
  }

  isRevenueAccountsAvailable(index, govRevenueAccountPk) {
    return !this.subAccountAmounts.value.find((e, i) =>
      e.revenueAccountPk === govRevenueAccountPk && i !== index
    );
  }

  onSelectRevenueAccount(index, revenueAccountPk) {
    const revAccount: RevenueAccount = this.revenueAccounts.find(
      (value) => value.govRevenueAccountPk == revenueAccountPk,
    )
    if (revAccount){
      if (this.subAccountAmounts.controls[index]) {
        this.subAccountAmounts.controls[index]
          .get('detail')
          .setValue(revAccount.revenueAccountName)
      }
    }
  }

  clickRemoveRow(rowIndex) {
    this.removeRow.emit(rowIndex)
  }

  clickAddRow() {
    this.addRow.emit(true)
  }

  getArrayControl(index, name): AbstractControl {
    return this.subAccountAmounts.controls[index].get(name)
  }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth
    window.addEventListener('resize', (res: Event) => {
      this.innerWidth = window.innerWidth
      if (this.innerWidth < 800) {
        this.mobile = true
        this.table?.rowDetail.expandAllRows()
      } else {
        this.mobile = false
        this.table?.rowDetail.collapseAllRows()
      }
    })
  }

  ngAfterViewChecked() {
    if (
      isPlatformBrowser(DatatableMobileComponent.platformId) &&
      this.innerWidth < 800
    ) {
      this.table.rowDetail.expandAllRows()
    }
  }

  onDetailToggle(event) {
    //console.log("onDetailToggle",event);
  }

  getRevenueAccountName(value) {
    let valor = value
    if (this.revenueAccounts.length > 0) {
      const finded = this.revenueAccounts.find((revenue) => {
        return revenue.govRevenueAccountPk === value
      })
      if (finded) {
        valor = finded.accountNumber
      }
    }
    return valor
  }

  getTrustedHtml(str) {
    return new DOMParser().parseFromString(str, 'text/html').documentElement
      .textContent
  }
}
