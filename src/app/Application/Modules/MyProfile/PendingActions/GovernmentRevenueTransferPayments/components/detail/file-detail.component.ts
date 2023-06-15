import {Component, OnInit} from '@angular/core'
import {Router} from '@angular/router'
import {TranslateService} from '@ngx-translate/core'
import {ResponseGenerateChallenge} from 'app/Application/Model/responsegeneratechallenge.type'
import {GovernmentRevenueTransferPaymentsService} from '../../government-revenue-transfer-payments.service'
import {AbstractAppComponent} from "../../../../../Common/Components/Abstract/abstract-app.component";

@Component({
    templateUrl: './file-detail.component.html',
})
export class FileDetailComponent extends AbstractAppComponent implements OnInit {
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
        super(translate)
        this.error.exist = false
    }

    ngOnInit(): void {
        super.ngOnInit();
        if (this.sharedData.govRevFileTransPayTableSelected.length === 0) {
            this.router.navigate([
                '/myprofile/pending/government-revenue-transfer-payments/step1',
            ])
            return;
        }
        setTimeout(() => {
            this.sharedData['isDetailActivated'] = true;
        }, 200);
        this.detailsData = this.sharedData.govRevFileTransPayTableSelected[0];
        this.service
            .authorizeValidate(
                [],
                this.sharedData.govRevFileTransPayTableSelected
            ).subscribe((result) => {
            if (result.validAuthDay == false) {
                this.error.exist = true
                this.error.description = this.translate.instant(
                    'governmentRevenue.invalidDayError',
                )
                this.error.description = this.error.description + result.day
            }
            if (result.batchFileList.toProcess.length != 0) {
                this.detailsData = result.batchFileList.toProcess[0];
            } else if (result.batchFileList.toAuthorize.length != 0) {
                this.detailsData = result.batchFileList.toAuthorize[0];
            } else if (result.batchFileList.notAllowed.length != 0) {
                this.detailsData = result.batchFileList.notAllowed[0];
            }
        })
    }

    valid() {
        return !this.error.exist
    }

    get company() {
        return this.service.company
    }
}
