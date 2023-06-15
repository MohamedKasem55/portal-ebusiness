import {Component, OnInit, HostListener, OnChanges, SimpleChanges} from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { DataTableWraperComponent } from '../../../../../../Components/common/data-table-wrapper.component'
import { StorageService} from "../../../../../../../core/storage/storage.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-account-table',
  templateUrl: './account-workflow-table.component.html',
})
export class AccountWorkflowTableComponent
  extends DataTableWraperComponent
  implements OnInit, OnChanges
{

  branch = ''
  subscriptions: Subscription[] = []

  constructor(public translate: TranslateService, public storageService: StorageService) {
    super()
  }

  ngOnInit(): void {
    super.ngOnInit()
    this.collapseAll()

    const company = this.storageService.retrieve('company')
    const currentLanguage = this.storageService.retrieve('currentLanguage')
    this.branch = currentLanguage == 'en' ? company.branchNameEn : company.branchName
    this.subscriptions.push(
        this.translate.onLangChange.subscribe((result) => {
          this.branch = result.lang == 'en' ? company.branchNameEn : company.branchName
        })
    )
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.items){
      changes.items.currentValue.forEach(e => {
        e.details.reverse()
        e.currency = this.getCurrencyFromAccountNumber(e.accountNumber)
      })
    }
  }

  getId(row) {
    return row['batchPk']
  }

  getIdFunction() {
    return this.getId.bind(this)
  }

  isRowChildContentExpanded(row) {
    return row['expandedChildContent']
  }

  collapseAll() {

    this.items.forEach(element => {
      element['expandedChildContent'] = false
    });
    if (this.table && this.table.rowDetail && !this.mobile) { this.table.rowDetail.collapseAllRows() }
  }

  showOrHideChildContent(row) {
    const state = row.expandedChildContent
    this.collapseAll()
    row.expandedChildContent = !state
    if (row.expandedChildContent && this.table && this.table.rowDetail && !this.mobile) { this.table.rowDetail.toggleExpandRow(row) }
  }

  onAllTablesResized() {
    this.items.forEach(row => {
      if (row['expandedChildContent']) {
        row['expandedChildContent'] = false
        this.showOrHideChildContent(row)
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe()
    })
    this.subscriptions = []
  }

  getCurrencyFromAccountNumber(accountNumber: string) {

    let currency = ''

    switch (accountNumber.length) {
      case 21:
        currency = accountNumber.substring(11,14)
        // accountDTO.setBranchid(fullAccount.substring(0,5));
        // accountDTO.setTypeAccount(fullAccount.substring(5,8));
        // accountDTO.setCode000(fullAccount.substring(8,11));
        // accountDTO.setNumberAccount(fullAccount.substring(14,20));
        // accountDTO.setCheckDigit(fullAccount.substring(20,21));
        break;
      case 18:
        currency = accountNumber.substring(8,11)
        // accountDTO.setBranchid(fullAccount.substring(0,5));
        // accountDTO.setTypeAccount(fullAccount.substring(5,8));
        // accountDTO.setNumberAccount(fullAccount.substring(11,17));
        // accountDTO.setCheckDigit(fullAccount.substring(17,18));
        // accountDTO.setCode000(ServiceConstants.CODE000);
        break;

      case 17:
        currency = accountNumber.substring(5,8)
        // accountDTO.setBranchid(fullAccount.substring(0,5));
        // accountDTO.setTypeAccount(fullAccount.substring(8,10));
        // accountDTO.setNumberAccount(fullAccount.substring(10,16));
        // accountDTO.setCheckDigit(fullAccount.substring(16,17));
        // accountDTO.setCode000(ServiceConstants.CODE000);
        break;

      case 15:
        currency = accountNumber.substring(3,6)
        // accountDTO.setBranchid(fullAccount.substring(0,3));
        // accountDTO.setTypeAccount(fullAccount.substring(6,8));
        // accountDTO.setNumberAccount(fullAccount.substring(8,14));
        // accountDTO.setCheckDigit(fullAccount.substring(14,15));
        // accountDTO.setCode000(ServiceConstants.CODE000);
        break;

      case 10:
        currency = '608'
        // accountDTO.setBranchid(fullAccount.substring(0,3));
        // accountDTO.setNumberAccount(fullAccount.substring(3,9));
        // accountDTO.setCheckDigit(fullAccount.substring(9,10));
        // accountDTO.setCode000(ServiceConstants.CODE000);
        // accountDTO.setTypeAccount("01");
        // accountDTO.setCurrency(ServiceConstants.SARCURRENCY);
        break;

      default:
        currency = '608'
        // accountDTO.setNumberAccount(fullAccount);
        break;
    }

    return currency
  }

}


