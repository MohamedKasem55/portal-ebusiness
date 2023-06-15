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
import { saveAs } from 'file-saver'

@Component({
  selector: 'contract',
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.scss'],
})
export class ContractComponent implements OnInit, OnDestroy {
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
        'POS_LAC',
        this.formModel.controls['financeID'].value,
        'Contract Of Commodity Sale',
        this.formModel.controls['productCode'].value)
      .subscribe((res) => {
        if (res != null) {
          this.formModel.controls['contractDownloaded'].setValue(true)
          saveAs(res.file, res.fileName)
        }
      })
  }
}
