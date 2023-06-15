import {Component, Input, OnDestroy, OnInit} from '@angular/core'
import {FormBuilder} from '@angular/forms'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import {FinanceProductDetailsService} from './finance-product-details.service'
import {FinanceProductCodeService} from "../finance-product-code.service";

@Component({
    selector: 'finance-product-details',
    templateUrl: './finance-product-details.component.html',
    styleUrls: ['./finance-product-details.component.scss'],
})
export class FinanceProductDetailsComponent implements OnInit, OnDestroy {

    public dossierID:string ;
    public showDetails: boolean = false
    public tabNumber: number = 1
    public financeData: any = []
    public installmentsDetails: any

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        private detailsService: FinanceProductDetailsService,
        public  financeProductCode:FinanceProductCodeService
    ) {
    }

    ngOnInit(): void {
        this.getContractList()
        this.getPendingContractList()
        if (localStorage.getItem('FINANCE_PRODUCT_TAB')) {
            this.tabNumber = Number(localStorage.getItem('FINANCE_PRODUCT_TAB'))
            localStorage.removeItem('FINANCE_PRODUCT_TAB')
        }
    }

    getContractList() {
        this.detailsService.getContractList('ONGOING').subscribe((result) => {
            if (result !== null && result.contractItems) {
                result.contractItems.forEach((element) => {
                    element.isShowMore = false
                    element.currency = 'SAR'
                    this.financeData.push(element)
                })
                if (this.financeData.length > 0) {
                    this.financeData[0].isShowMore = true
                }
            }
        })
    }
    getPendingContractList(){
        this.detailsService.getContractList('PENDING').subscribe((result) => {
            if (result !== null && result.contractItems) {
                result.contractItems.forEach((element) => {
                    if (element?.productKey?.productCode === this.financeProductCode.FLEET_FINANCE_COMMERCIAL_VEHICLE()) // there are an existing open fleet request
                    {
                        // this.dossierID = element?.dossierID
                    }
                });
            }
        })

    }

    ngOnDestroy(): void {
    }

    newFinanceRequest(): void {


       if (this.dossierID === null || this.dossierID === undefined){
            this.router.navigate(['/financeProduct/newRequest'])
        }else {
           this.router.navigate(['/financeProduct/newRequest/existing-user'], { queryParams: {dossierID:this.dossierID},skipLocationChange:true})
        }
    }

    viewInstallmentsDetails(dossierID) {
        this.detailsService.getInstallmentDetails(dossierID).subscribe((result) => {
            if (result !== null) {
                this.installmentsDetails = result.installments
                this.showDetails = true
            }
        })
    }

    hideInstallmentsDetails() {
        this.installmentsDetails = {}
        this.showDetails = false
    }
}
