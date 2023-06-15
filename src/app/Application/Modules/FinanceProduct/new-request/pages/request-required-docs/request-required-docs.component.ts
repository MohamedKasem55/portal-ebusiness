import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { ConfigResourceService } from 'app/core/config/config.resource.local'
import { TranslateService } from '@ngx-translate/core'
import { ResponseGenerateChallenge } from 'app/Application/Model/responsegeneratechallenge.type'
import { RequestValidate } from 'app/Application/Model/requestvalidateType'
import { Breadcrumb } from 'app/Application/Modules/FinanceProduct/shared/models/common'
import { Subscription } from 'rxjs'
import { ProductInfo } from '../../models/common'
import { FinanceProductCodeService } from '../../../finance-product-code.service'
import { FinanceProductNewRequestService } from '../../../pos/NewRequest/finance-product-new-request.service'
import {FinanceFleetNewReqService} from "../../../fleet/requests/fleet-finance.service";
import {CheckKeyItems} from "../../../../../Model/checkKeyItems";


@Component({
    selector: 'request-required-docs',
    templateUrl: './request-required-docs.component.html',
    styleUrls: ['./request-required-docs.component.scss'],
})
export class RequestRequiredDocsComponent implements OnInit, OnDestroy {
    public requestValidate: RequestValidate = new RequestValidate()
    public generateChallengeAndOTP: ResponseGenerateChallenge
    public CheckKeyItems: CheckKeyItems
    public productName = '';
    public productInfo: ProductInfo;
    public requiredDocsList: any = []
    public OTP = false
    public productCode;
    breadCrumb: Breadcrumb[] = []
    subscriptions: Subscription[] = []
    public Terms;

    constructor(
        private router: Router,
        private _config: ConfigResourceService,
        public translate: TranslateService,
        public activeRoute: ActivatedRoute,
        private fleetServiceReq: FinanceFleetNewReqService,
        private financeProductCode: FinanceProductCodeService,
        private newRequestService: FinanceProductNewRequestService,
    ) {
        this.breadCrumb = [
            { txt: 'financeProduct.menu', active: false },
            { txt: 'financeProduct.newRequest.newRequest', active: true },
        ]
    }

    ngOnInit(): void {

        this.subscriptions.push(
            this.activeRoute.queryParams
                .subscribe(params => {
                        this.productName = params.productName;
                        if (this.productName == 'financeProduct.bifFinance') {
                            this.productCode = this.financeProductCode.BIF_PRODUCT_CODE();
                            this.productInfo = {
                                title : this.productName,
                                image : 'assets/img/bif.png',
                                icon: 'assets/icons/bif-finance.svg',
                                desc : 'financeProduct.bifDesc',
                                maxAmount: '250000',
                            };

                        } else if (this.productName == 'financeProduct.ecommerceFinance') {
                            this.productCode = this.financeProductCode.Ecommerce_PRODUCT_CODE();
                            this.productInfo = {
                                title : this.productName,
                                image : 'assets/img/e-commerce.png',
                                icon : 'assets/icons/ecommerce-finance.svg',
                                desc : 'financeProduct.eCommerceDesc',
                                maxAmount: '5000000',
                            }
                        } else if(this.productName == 'financeProduct.fleetFinance') {
                            this.validateEligibility()
                        }
                        this.getRequiredDocs();
                    }
                )
        );

    }

    openTermsAndConditions() {
        window.open(
            this._config.getDocumentUrl() +
            '/AlRajhi_Business_FAQ_V2.4_' +
            this.translate.currentLang +
            '.pdf',
        )
    }

    navigateTo(pageRoute): void {
        this.router.navigate([`${pageRoute}`], { queryParams: {productName:this.productName}})
    }

    proceed() {
        if(this.productInfo?.title ==='financeProduct.fleetFinance') {
            this.OTP = true;
        } else {
            this.navigateTo('/financeProduct/pos');
        }
    }

    initiate() {}

    getRequiredDocs() {
        if(this.productName == 'financeProduct.fleetFinance') {
            this.subscriptions.push(
                this.fleetServiceReq.getMandatoryDocs().subscribe((res) => {
                    if (res === null) {
                        this.router.navigate(['/']).then(() => {})
                    } else {
                        res.documentInfos.map(element => {
                            this.requiredDocsList.push(element.description)
                        })
                    }
                })
            )
        } else {
            this.newRequestService.getMandatoryDocuments(this.productCode).subscribe((res) => {
                if (res.documentInfos) {
                    res.documentInfos.map(element => {
                        this.requiredDocsList.push(element.description)
                    })
                }
            })
        }

    }

    validateEligibility() {
        this.subscriptions.push(
            this.fleetServiceReq.validateEligibility().subscribe((res) => {
                if (res === null) {
                    this.router.navigate(['/']).then(() => {})
                } else {
                    this.CheckKeyItems = res.checkKeyItems[0]
                    this.generateChallengeAndOTP = res.generateChallengeAndOTP
                    this.productInfo = {
                        title : this.productName,
                        image : 'assets/img/cars.png',
                        icon : 'assets/icons/fleet-finance.svg',
                        desc : 'fleet.newRequest.requiredDocsDesc1',
                        maxAmount: this.CheckKeyItems?.maxIndicativeAmt,
                    }
                    sessionStorage.setItem('fleetLimit',this.productInfo.maxAmount)
                }
            })
        )
    }

    processOTP() {
        this.router.navigate(['financeProduct/fleet/request/add-request'])
    }

    canProceed() {
        return !this.requestValidate.valid()
    }
    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => {
            subscription.unsubscribe()
        })
    }
}
