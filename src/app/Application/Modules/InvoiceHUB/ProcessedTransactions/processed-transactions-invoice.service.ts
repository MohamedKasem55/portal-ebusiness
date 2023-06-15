import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EsalPaymentsBatch } from './list/processed-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessedTransactionsInvoiceService {
  selectedItem: EsalPaymentsBatch = null;
  constructor(protected translate: TranslateService) { }

  public getSelectedItem(): EsalPaymentsBatch | null {
    return this.selectedItem ? this.selectedItem : null
  }

  public setSelectedItem(itemDetails: EsalPaymentsBatch) {
    this.selectedItem = itemDetails
  }
}
