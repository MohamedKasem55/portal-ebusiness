import { isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProcessedTransactionsDetailService } from './processed-transactions-detail.service';
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../../../../../../core/security/authentication.service";
import { AbstractDatatableMobileComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-datatable-mobile.component';
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { Router } from '@angular/router';
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { BillPaymentsBatch } from '../list/processed-transactions.model';
import { ProcessedTransactionsBillService } from '../processed-transactions-bill.service';
@Component({
  selector: 'app-processed-transactions-detail',
  templateUrl: './processed-transactions-detail.component.html'
})
export class ProcessedTransactionsDetailComponent extends AbstractAppComponent implements OnInit {
  entityPropertiesbillProcessTransactions: any[]
  billProcessTransactionsForm: FormGroup
  selectedItem: BillPaymentsBatch;
  constructor(public detailsService: ProcessedTransactionsDetailService, public fb: FormBuilder, public processTransactionsBillService: ProcessedTransactionsBillService, public staticService: StaticService, public translate: TranslateService, public authenticationService: AuthenticationService, public router: Router) {
    super(translate)
    this.entityPropertiesbillProcessTransactions = []
  }

  ngOnInit(): void {
    super.ngOnInit()
  }
  refreshData() {
    this.selectedItem = this.processTransactionsBillService.getSelectedItem()
    this.entityPropertiesbillProcessTransactions = this.detailsService.getFieldEntityPropertiesbillProcessTransactions(this.selectedItem)
    this.billProcessTransactionsForm = this.fb.group({})
    if (!this.selectedItem) {
      this.router.navigate(['/payments/billPayments/processedTransactions']);
    }
  }
  getId(row) {
    return row[this.getIdFieldName()]
  }
  getIdFieldName() {
    return 'batchId'
  }
  getBackUrl() {
    return '/payments/billPayments/processedTransactions'
  }
}
