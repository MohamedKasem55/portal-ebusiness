import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FormBuilder } from '@angular/forms'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FinanceProductCodeService } from '../../../finance-product-code.service'

@Component({
  selector: 'application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit, OnDestroy {
  @Input() formModel: any
  public MRCC_PRODUCT_CODE = ''
  public POS_PRODUCT_CODE = ''

  constructor(
    public fb: FormBuilder,
    public router: Router,
    public translate: TranslateService,
    private financeProductCode: FinanceProductCodeService,
  ) {}

  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.MRCC_PRODUCT_CODE = this.financeProductCode.MRCC_PRODUCT_CODE()
    this.POS_PRODUCT_CODE = this.financeProductCode.POS_PRODUCT_CODE()
  }
}
