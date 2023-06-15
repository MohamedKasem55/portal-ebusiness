import { isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProcessedTransactionsDetailService } from './processed-transactions-detail.service';
import { TranslateService } from "@ngx-translate/core";
import { AuthenticationService } from "../../../../../core/security/authentication.service";
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { Router } from '@angular/router';
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { EsalPaymentsBatch } from '../list/processed-transactions.model';
import { ProcessedTransactionsInvoiceService } from '../processed-transactions-invoice.service';
@Component({
  selector: 'app-processed-transactions-detail',
  templateUrl: './processed-transactions-detail.component.html'
})
export class ProcessedTransactionsDetailComponent extends AbstractAppComponent implements OnInit {
  entityPropertiesEsalProcessTransactions: any[]
  esalProcessTransactionsForm: FormGroup
  selectedItem: EsalPaymentsBatch;
  constructor(public listService: ProcessedTransactionsDetailService, public fb: FormBuilder, public processedTransactionsInvoiceService: ProcessedTransactionsInvoiceService, public detailsService: ProcessedTransactionsDetailService, public staticService: StaticService, public translate: TranslateService, public authenticationService: AuthenticationService, public router: Router) {
    super(translate)
    this.entityPropertiesEsalProcessTransactions = []
  }

  ngOnInit(): void {
    super.ngOnInit()
  }
  refreshData() {
    this.selectedItem = this.processedTransactionsInvoiceService.getSelectedItem()
    this.entityPropertiesEsalProcessTransactions = this.listService.getFieldEntityPropertiesEsalProcessTransactions(this.selectedItem)
    this.esalProcessTransactionsForm = this.fb.group({})
    if (!this.selectedItem) {
      this.router.navigate(['/invoiceHUB/processedTransactions/list']);
    }
  }
  getId(row) {
    return row[this.getIdFieldName()]
  }
  getIdFieldName() {
    return 'batchId'
  }
  getBackUrl() {
    return '/invoiceHUB/processedTransactions/list'
  }
}
