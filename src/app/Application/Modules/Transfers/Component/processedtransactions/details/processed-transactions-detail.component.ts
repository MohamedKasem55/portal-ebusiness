import { isEmpty } from 'lodash';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProcessedTransactionsDetailService } from './processed-transactions-detail.service';
import { TranslateService } from "@ngx-translate/core";
import { StaticService } from 'app/Application/Modules/Common/Services/static.service';
import { Router } from '@angular/router';
import { AbstractAppComponent } from 'app/Application/Modules/Common/Components/Abstract/abstract-app.component';
import { ProcessedTransactionsService } from '../processed-transactions.service';
import { AuthenticationService } from 'app/core/security/authentication.service';
import { BatchSecurity } from 'app/Application/Model/Batch/BatchSecurity';
@Component({
  selector: 'app-processed-transactions-detail',
  templateUrl: './processed-transactions-detail.component.html'
})
export class ProcessedTransactionsDetailComponent extends AbstractAppComponent implements OnInit {
  entityPropertiesTransferProcessTransactions: any[]
  transferProcessTransactionsForm: FormGroup
  selectedItem: any;
  securityLevels: BatchSecurity
  constructor(public listService: ProcessedTransactionsDetailService, 
    public fb: FormBuilder, 
    public processedTransactionsInvoiceService: ProcessedTransactionsService, 
    public detailsService: ProcessedTransactionsDetailService, 
    public staticService: StaticService, public translate: TranslateService, 
    public authenticationService: AuthenticationService, public router: Router) {
    super(translate)
    this.entityPropertiesTransferProcessTransactions = []
  }

  ngOnInit(): void {
    super.ngOnInit()
  }
  refreshData() {
    this.selectedItem = this.processedTransactionsInvoiceService.getSelectedItem()
    if (!this.selectedItem) {
      this.router.navigate(['/transfers/processedTransactions']);
    }
    this.detailsService.getTransferDetails(this.selectedItem).subscribe((result: any) =>{
      if (result.errorCode && result.errorCode === '0') {
        this.securityLevels = result.securityLevelsDTOList
        this.entityPropertiesTransferProcessTransactions = this.listService.getFieldEntityPropertiesEsalProcessTransactions(this.selectedItem)
        this.transferProcessTransactionsForm = this.fb.group({})
      } else {
        this.router.navigate(['/transfers/processedTransactions']);
      }
    });
    
  }
  getId(row) {
    return row[this.getIdFieldName()]
  }
  getIdFieldName() {
    return 'batchId'
  }
  getBackUrl() {
    return '/transfers/processedTransactions'
  }
}
