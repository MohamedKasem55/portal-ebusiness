import {Component, EventEmitter, OnInit, Output} from '@angular/core'
import {Router} from '@angular/router'
import {FinanceFleetNewReqService} from "../../fleet-finance.service";
import {FormBuilder} from "@angular/forms";
import {TranslateService} from "@ngx-translate/core";

@Component({
    selector: 'initial-offer-step',
    templateUrl: './initial-offer-step.component.html',
    styleUrls: ['./initial-offer-step.component.scss'],
})
export class InitialOfferStepComponent implements OnInit {
    @Output() NextStep: EventEmitter<Number> = new EventEmitter()
    public dossairID;
    public totalReqFinanceAmt = 0
    public totalMonthlyPmt = 0
    public totalREPmtAmt = 0
    public totalDownPmt = 0
    public totalAdminFee = 0
    public totalTenures = 0
    public customerOfferDetails: any;
    public hashSet: any = [];

    constructor(
        public fb: FormBuilder,
        public router: Router,
        public translate: TranslateService,
        private fleetServiceReq: FinanceFleetNewReqService,) {
        this.dossairID = sessionStorage.getItem("dossairID")
    }

    ngOnInit(): void {
        this.fleetServiceReq.setCurrentStep(5);
        this.getInitOffer();
    }

    navigateTo(stepNumber: number): void {
        this.NextStep.emit(stepNumber)
    }

    viewBreakdown() {
        this.router.navigate([
            'financeProduct/fleet/request/initialOffer/breakdown',
        ])
    }

    getInitOffer() {
        let data = {
            dossierId: this.dossairID
        }
        this.fleetServiceReq.getInitialOfferInq(data).subscribe((res) => {
            if (res === null) {
                this.router.navigate(['/']).then(() => {
                })
            } else {

                this.customerOfferDetails = res?.customerOfferDetails

                sessionStorage.setItem('quotationDetails', JSON.stringify(res)); // store initial offer api response to be used in summary screen

                this.customerOfferDetails?.custOfferVehicleGroupLstItemTypes?.map(item => {

                    if (Object.keys(this.hashSet).length === 0) {
                        this.hashSet.push({
                            tenure: item?.tenure,
                            MonthlyInstallmentAmt: item.firstInstallmentAmt
                        });
                    }
                    if (this.customerOfferDetails?.custOfferVehicleGroupLstItemTypes.length > 1 && Object.keys(this.hashSet).length > 0) {
                        let duplicateTenure = this.customerOfferDetails?.custOfferVehicleGroupLstItemTypes.filter(function (elm_el) {
                            return this.hashSet.filter(function (hashSet_el) {
                                return hashSet_el?.tenure === elm_el?.tenure;
                            })
                        })
                        if (duplicateTenure) {
                            Object.assign(this.hashSet[this.hashSet.findIndex(el => el?.tenure === duplicateTenure?.tenure)].MonthlyInstallmentAmt, duplicateTenure?.firstInstallmentAmt +
                                this.hashSet[this.hashSet.findIndex(el => el?.tenure === duplicateTenure?.tenure)].MonthlyInstallmentAmt)
                        } else {
                            this.hashSet.push({
                                tenure: item?.tenure,
                                MonthlyInstallmentAmt: item.firstInstallmentAmt
                            });
                        }
                    }
                    this.totalReqFinanceAmt = this.customerOfferDetails.totalFinanceAmt
                    this.totalDownPmt = this.customerOfferDetails.totalDownPayment
                    this.totalMonthlyPmt = this.customerOfferDetails.installmentsList[0].monthlyInstallmentAmt // first value from installment amount list
                    this.totalAdminFee = this.customerOfferDetails.totaldminFeeAmt
                    this.totalTenures += item.tenure

                    this.customerOfferDetails.installmentsList?.map(lst => {
                        this.totalREPmtAmt += lst.monthlyInstallmentAmt
                    })

                })

                let amtDetails = {
                    requestedAmt: this.totalReqFinanceAmt,
                    tenure: this.totalTenures,
                    installmentAmt: this.totalMonthlyPmt,
                    DownPmt: this.totalDownPmt,
                    totalAdminFee: this.totalAdminFee,
                    totalREPmtAmt: this.totalREPmtAmt

                }
                sessionStorage.setItem('amtDetails', JSON.stringify(amtDetails));

            }
        })

    }
}