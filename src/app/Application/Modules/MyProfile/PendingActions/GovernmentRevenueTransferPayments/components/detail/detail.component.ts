import {Component, OnDestroy, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import {GovernmentRevenueTransferPaymentsService} from '../../government-revenue-transfer-payments.service'
import {AbstractAppComponent} from "../../../../../Common/Components/Abstract/abstract-app.component";

@Component({
    templateUrl: './detail.component.html',
})
export class DetailComponent extends AbstractAppComponent implements OnInit, OnDestroy {
    step = 1
    sharedData: any = {}
    tableDisplaySize = 20

    error: any = {}

    generateChallengeAndOTP: ResponseGenerateChallenge
    detailsData: any = {}

    constructor(
        private service: GovernmentRevenueTransferPaymentsService,
        public translate: TranslateService,
        private router: Router,
    ) {
        super(translate);
        this.error.exist = false
    }

    ngOnInit(): void {
        super.ngOnInit();

        if (this.sharedData.govRevTransPayTableSelected.length === 0) {
            this.router.navigate([
                '/myprofile/pending/government-revenue-transfer-payments/step1',
            ])
            return;
        }
        setTimeout(() => {
            this.sharedData['isDetailActivated'] = true;
        }, 200);
        this.subscriptions.push(
            this.service
                .authorizeValidate(
                    this.sharedData.govRevTransPayTableSelected,
                    []
                )
                .subscribe((result) => {
                    if (result.validAuthDay == false) {
                        this.error.exist = true
                        this.error.description = this.translate.instant(
                            'governmentRevenue.invalidDayError',
                        )
                        this.error.description = this.error.description + result.day
                    }
                    this.detailsData = result
                })
        );
    }

    ngOnDestroy() {
        super.ngOnDestroy();
    }

    valid() {
        return !this.error.exist
    }

    getGovPayment() {
        let payment = {}
        if (
            this.detailsData.batchList &&
            this.detailsData.batchList.toProcess.length > 0
        ) {
            payment = this.detailsData.batchList.toProcess[0]
        } else if (
            this.detailsData.batchList &&
            this.detailsData.batchList.toAuthorize.length > 0
        ) {
            payment = this.detailsData.batchList.toAuthorize[0]
        } else if (
            this.detailsData.batchList &&
            this.detailsData.batchList.notAllowed.length > 0
        ) {
            payment = this.detailsData.batchList.notAllowed[0]
        }
        return payment
    }

    get company() {
        return this.service.company
    }


}
