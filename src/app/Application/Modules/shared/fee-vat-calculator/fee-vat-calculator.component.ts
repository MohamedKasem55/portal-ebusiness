import { Component, Input, OnInit } from '@angular/core'
import { StorageService } from '../../../../core/storage/storage.service'

@Component({
  templateUrl: 'fee-vat-calculator.component.html',
  selector: 'app-vat-calculator',
})
export class FeeVatCalculator implements OnInit {
  public vat: number

  @Input()
  public fee: number

  constructor(private _storage: StorageService) {}

  public ngOnInit(): void {
    this._getVat()
  }

  private _getVat(): void {
    const parameters = this._storage.retrieve('parameters')
    this.vat = +parameters.items['vatPercentage'].value
  }

  get vatFee(): number {
    if (this.vat && this.fee) {
      return +this.fee * (1 - 1 / (1 + +this.vat / 100))
    }
    return 0
  }

  get base(): number {
    if (this.vat && this.fee) {
      return +this.fee / (1 + +this.vat / 100)
    }
    return 0
  }
}
