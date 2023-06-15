import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BillPaymentsBatch } from './list/processed-transactions.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessedTransactionsBillService {
  selectedItem: BillPaymentsBatch = null;
  constructor(protected translate: TranslateService) { }

  public getSelectedItem(): BillPaymentsBatch | null {
    return this.selectedItem ? this.selectedItem : null
  }

  public setSelectedItem(itemDetails: BillPaymentsBatch) {
    this.selectedItem = itemDetails
  }
}
