import { Component, OnDestroy, OnInit, Input } from '@angular/core'
import { FinanceProductDetailsService } from '../../finance-product-details.service'
import { FinanceProductCodeService } from '../../../finance-product-code.service'

@Component({
  selector: 'finalOffer',
  templateUrl: './final-offer.component.html',
  styleUrls: ['./final-offer.component.scss'],
})
export class FinalOfferComponent implements OnInit, OnDestroy {
  @Input() formModel: any
  public MRCC_PRODUCT_CODE = ''
  public POS_PRODUCT_CODE = ''

  constructor(
    private detailsService: FinanceProductDetailsService,
    private financeProductCode: FinanceProductCodeService,
  ) {
  }


  ngOnInit(): void {
    this.MRCC_PRODUCT_CODE = this.financeProductCode.MRCC_PRODUCT_CODE()
    this.POS_PRODUCT_CODE = this.financeProductCode.POS_PRODUCT_CODE()
  }

  ngOnDestroy(): void {
  }

}
