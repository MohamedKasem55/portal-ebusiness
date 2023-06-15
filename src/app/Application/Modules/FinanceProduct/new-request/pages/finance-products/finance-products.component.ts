import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {ProductFinace} from '../../models/common';
import {FinanceFleetNewReqService} from 'app/Application/Modules/FinanceProduct/fleet/requests/fleet-finance.service'
import {CheckKeyItems} from 'app/Application/Model/checkKeyItems'
import {Breadcrumb} from 'app/Application/Modules/FinanceProduct/shared/models/common'
import {Subscription} from 'rxjs'
import {AuthenticationService} from "../../../../../../core/security/authentication.service";
import {FinanceProductDetailsService} from "../../../Details/finance-product-details.service";
import {FinanceProductCodeService} from "../../../finance-product-code.service";

@Component({
    selector: 'arb-finance-products',
    templateUrl: './finance-products.component.html',
    styleUrls: ['./finance-products.component.scss']
})
export class FinanceProductsComponent implements OnInit {

    @Input() iniatFormModel: FormGroup
    @Input() informationFormModel: FormGroup
    @Input() mandatoryDocuments: any = []
    @Input() targetPage = 'FLEET';
    @Output() onPagePicked = new EventEmitter<any>();
    breadCrumb: Breadcrumb[] = [];
    subscriptions: Subscription[] = []
    public validateRes: any
    public errorList: any = []
    public eligibleFlg = true
    public CheckKeyItems: CheckKeyItems
    public dossierID:string ;

    financeProduct: ProductFinace[];
    filteredFinanceProduct: ProductFinace[];

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        private fleetServiceReq: FinanceFleetNewReqService,
        private detailsService: FinanceProductDetailsService,
        public  financeProductCode:FinanceProductCodeService,
        private authenticationService: AuthenticationService
    ) {
        this.breadCrumb = [
            {txt: 'financeProduct.menu', active: false},
            {txt: 'financeProduct.newRequest.newRequest', active: true},
        ]
    }

    public onPage(page: any): void {
        this.onPagePicked.emit(page);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe()
        })
    }


    ngOnInit(): void {
        this.financeProduct = [
            {
                name: 'financeProduct.fleetFinance',
                desc: 'financeProduct.fleetDesc',
                icon: 'assets/icons/fleet-finance.svg',
                id: 'fleet',
                visible: this.authenticationService.activateOption('FleetFinance',[],[])
            },
            {
                name: 'financeProduct.posFinance',
                desc: 'financeProduct.posDesc',
                icon: 'assets/icons/pos-finance.svg',
                id: 'pos',
                visible: this.authenticationService.activateOption('POSFinance',[],[])
            },
            {
                name: 'financeProduct.bifFinance',
                desc: 'financeProduct.bifFinanceDesc',
                icon: 'assets/icons/bif-finance.svg',
                id: 'bif',
                visible: this.authenticationService.activateOption('BIFfinance',[],[])
            },
            {
                name: 'financeProduct.ecommerceFinance',
                desc: 'financeProduct.eCommerceFinanceDesc',
                icon: 'assets/icons/ecommerce-finance.svg',
                id: 'ecommerce',
                visible: this.authenticationService.activateOption('Ecommerce',[],[])
            }
        ]
        this.filteredFinanceProduct  = this.financeProduct.filter((item) => item.visible === true)
        this.getPendingContractList()
    }

    validateEligibility() {
        this.subscriptions.push(
            this.fleetServiceReq.validateEligibility().subscribe((res) => {
                if (res === null) {
                    this.router.navigate(['/']).then(() => {
                    })
                } else {
                    this.validateRes = res
                    this.CheckKeyItems = res.checkKeyItems[0]
                    this.errorList = res?.errorList
                }
            })
        )

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
    selectProduct(product:ProductFinace){
        if (!this.CheckKeyItems?.eligibleFlg || this.CheckKeyItems?.maxIndicativeAmt ||
            this.CheckKeyItems?.maxIndicativeAmt <= '0' || this.CheckKeyItems?.maxIndicativeAmt === null ){
            this.eligibleFlg = false
        }else{
            this.eligibleFlg = this.CheckKeyItems?.eligibleFlg
        }
        if (product.id == 'fleet') {
            console.log(this.dossierID)
            if (this.dossierID){
                this.router.navigate(['/financeProduct/newRequest/existing-user'], { queryParams: {dossierID:this.dossierID},skipLocationChange:true})
            }else {
                this.router.navigate(['financeProduct/newRequest/required-docs'], {
                    queryParams: {productName: product.name},
                })
            }
        } else if(product.id == 'pos'){
            this.router.navigate(['financeProduct/pos'], { queryParams: {productName:'financeProduct.posFinance'}});
        }
        else {
            this.router.navigate(['financeProduct/newRequest/required-docs'], { queryParams: {productName:product.name}});
        }

  }

}
