import {
  Component,
  OnDestroy,
  OnInit,
  Input,
} from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FinanceProductDetailsService } from '../../finance-product-details.service'
import {saveAs} from "file-saver";

@Component({
  selector: 'sell-commodity',
  templateUrl: './sell-commodity.component.html',
  styleUrls: ['./sell-commodity.component.scss'],
})
export class SellCommodityComponent implements OnInit, OnDestroy {
  @Input() formModel: any

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private detailsService: FinanceProductDetailsService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  getContract() {
    this.detailsService
      .getPrintableDocuments(
        'SellingContract',
        this.formModel.controls['financeID'].value,
        'Selling Contract',
        this.formModel.controls['productCode'].value)
      .subscribe((res) => {
        if (res != null) {
          saveAs(res.file, res.fileName)
        }
      })
  }
}
