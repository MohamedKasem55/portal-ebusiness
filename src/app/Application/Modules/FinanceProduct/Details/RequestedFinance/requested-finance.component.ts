import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { TranslateService } from '@ngx-translate/core'
import { FormBuilder } from '@angular/forms'
import { FinanceProductDetailsService } from '../finance-product-details.service'
import { DatePipe } from '@angular/common'
import { FinanceProductCodeService } from '../../finance-product-code.service'

@Component({
  selector: 'requested-finance',
  templateUrl: './requested-finance.component.html',
  styleUrls: ['./requested-finance.component.scss'],
})
export class RequestedFinance implements OnInit, OnDestroy {
  @ViewChild('RequestTable', { static: true }) table: any

  public data: any = []
  public footerHeight: any = 0
  public defaultHeight: any = 'auto'

  constructor(
      public fb: FormBuilder,
      public router: Router,
      public translate: TranslateService,
      private detailsService: FinanceProductDetailsService,
      private datePipe: DatePipe,
      private productCodeSrv: FinanceProductCodeService,
  ) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
    this.detailsService.getContractList('PENDING').subscribe((result) => {
      if (result !== null) {
        this.data = result.contractItems
        this.data.forEach((element) => {
          element.currency = 'SAR'
          element.contractDate = this.getDate(element.contractDate)
          if (element.productKey.productCode === this.productCodeSrv.POS_PRODUCT_CODE()) {
            element.financeType = this.translate.instant('financeProduct.posFinance')
            element.financeKey = 'financeProduct.posFinance';
          } else if (element.productKey.productCode === this.productCodeSrv.BIF_PRODUCT_CODE()) {
            element.financeType = this.translate.instant('financeProduct.bifFinance')
            element.financeKey = 'financeProduct.bifFinance';
          } else if (element.productKey.productCode === this.productCodeSrv.Ecommerce_PRODUCT_CODE()) {
            element.financeType = this.translate.instant('financeProduct.ecommerceFinance')
            element.financeKey = 'financeProduct.ecommerceFinance';
          }
        })
      }
    })
  }

  isApproved(status) {
    return status === 'APS' || status === 'APD' || status === 'CTD'
  }

  canProceed(row) {
    if (row.financeKey === 'financeProduct.posFinance'){
      if (row.hasDisbursmentDossier) {
        const dossierStatus = row.firstDisbursmentDossierStatus
        return (
            dossierStatus === 'DDP' ||
            dossierStatus === 'DBD' ||
            dossierStatus === 'DCS' ||
            dossierStatus === 'DDW' ||
            dossierStatus === 'DSS'
        )
      } else {
        return this.isApproved(row.dossierStatus)
      }
    } else {
      return false;
    }

  }

  getStatus(row) {
    if (this.isApproved(row.dossierStatus)) {
      if (row.hasDisbursmentDossier) {
        switch (row.firstDisbursmentDossierStatus) {
          case 'DDP':
            return 'financeProduct.details.p-buyingCommodities'
          case 'DDW':
            return 'financeProduct.details.p-buyingAccepting'
          case 'IVW':
            return 'financeProduct.details.p-ivw'
          case 'IVC':
            return 'financeProduct.details.p-ivw'
          case 'IVJ':
            return 'financeProduct.details.p-ivj'
          case 'DBD':
            return 'financeProduct.details.p-sellingOrDelivery'
          case 'DCS':
            return 'financeProduct.details.p-sellingOrDelivery'
          case 'DSS':
            return 'financeProduct.details.p-promissoryAccept'
          case 'DFP':
            return 'financeProduct.details.p-signPromissory'
          default:
            return 'financeProduct.details.underProcessing'
        }
      } else {
        return 'financeProduct.details.approved'
      }
    } else if(row.dossierStatus === 'RJC') {
      return 'financeProduct.details.rejected'
    }
    else {
      return 'financeProduct.details.underApproval'
    }
  }

  showDetails(data) {
    if (this.canProceed(data)) {
      localStorage.setItem(
          'FINANCE_PRODUCT_EXECUTION',
          JSON.stringify({
            dossierID: data.dossierID,
            amount: data.amt,
            productCode: data.productKey.productCode,
            status: data.firstDisbursmentDossierStatus,
            hasDisbursmentDossier: data.hasDisbursmentDossier,
          }),
      )
      this.router.navigate(['/financeProduct/details/execution'])
    }
  }

  getDate(date) {
    if (date.timestamp) {
      return this.datePipe.transform(new Date(date.timestamp), 'dd/MM/yyyy')
    } else {
      return ''
    }
  }
}
